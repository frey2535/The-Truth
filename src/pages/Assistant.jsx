import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, ShieldCheck, Square, History, PlusCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import HistoryDialog from "@/components/assistant/HistoryDialog";
import { SEARCH_CORPORA, SOURCE_LABEL } from "@/lib/localCorpusSearch";

const QUOTE_BATCH = 40;

function StoredWording({ passages }) {
  const rows = Array.isArray(passages) ? passages : [];
  const [shown, setShown] = useState(Math.min(QUOTE_BATCH, rows.length));

  useEffect(() => {
    setShown(Math.min(QUOTE_BATCH, rows.length));
  }, [passages, rows.length]);

  useEffect(() => {
    if (shown >= rows.length) return undefined;
    const id = window.setTimeout(() => setShown((n) => Math.min(n + QUOTE_BATCH, rows.length)), 0);
    return () => window.clearTimeout(id);
  }, [shown, rows.length]);

  if (!rows.length) return null;
  let lastGroup = "";
  return (
    <div className="mt-4 space-y-3">
      {rows.slice(0, shown).map((p, i) => {
        const group = SOURCE_LABEL[p.source] || p.source || "stored text";
        const heading = group !== lastGroup;
        lastGroup = group;
        return (
          <div key={`${p.source}|${p.reference}|${i}`}>
            {heading ? <h4 className="font-display text-lg text-[#7a2e2e] mt-4 mb-2">{group}</h4> : null}
            <p className="font-medium text-[#2b2620]">{p.reference}</p>
            <blockquote className="border-l-2 border-[#c4b59a] pl-3 my-1 text-[#3a3328]">{p.text}</blockquote>
          </div>
        );
      })}
      {shown < rows.length ? (
        <p className="text-sm text-[#8a7f6f]">
          Showing {shown} of {rows.length} stored passages…
        </p>
      ) : null}
    </div>
  );
}

export default function Assistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);
  const turnRef = useRef(null);
  const reqId = useRef(0);

  const [conversationId, setConversationId] = useState(null);
  const [corpus, setCorpus] = useState("all");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useLayoutEffect(() => {
    if (loading) return;
    const pane = listRef.current;
    const turn = turnRef.current;
    if (!pane || !turn) return;
    pane.scrollTop = Math.max(0, turn.offsetTop);
  }, [messages.length, loading]);

  async function loadConversations() {
    setHistoryLoading(true);
    try {
      const list = await base44.entities.Conversation.list("-updated_date", 50);
      setConversations(list || []);
    } catch {
      setConversations([]);
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => {
    if (historyOpen) loadConversations();
  }, [historyOpen]);

  function titleFromMessages(msgs) {
    const first = msgs.find((m) => m.role === "user");
    return (first?.content || "New conversation").slice(0, 80);
  }

  async function persist(finalMessages, id) {
    const title = titleFromMessages(finalMessages);
    try {
      if (id) {
        await base44.entities.Conversation.update(id, { messages: finalMessages, title });
        return id;
      }
      const c = await base44.entities.Conversation.create({ title, messages: finalMessages });
      return c.id;
    } catch {
      return id;
    }
  }

  async function send(e) {
    e.preventDefault();
    const q = input.trim();
    if (!q || loading) return;
    const next = [...messages, { role: "user", content: q }];
    setMessages(next);
    setInput("");
    setLoading(true);
    const myId = ++reqId.current;
    try {
      const res = await base44.functions.invoke("study_assistant", {
        question: q,
        history: messages,
        corpus,
      });
      if (reqId.current !== myId) return;
      if (res.data?.error) throw new Error(res.data.error);
      const final = [
        ...next,
        {
          role: "assistant",
          content: res.data.answer,
          passages: Array.isArray(res.data.passages) ? res.data.passages : [],
        },
      ];
      setMessages(final);
      const newId = await persist(final, conversationId);
      if (reqId.current === myId) setConversationId(newId);
    } catch (err) {
      if (reqId.current !== myId) return;
      const final = [
        ...next,
        { role: "assistant", content: "I ran into a problem researching that: " + err.message },
      ];
      setMessages(final);
      const newId = await persist(final, conversationId);
      if (reqId.current === myId) setConversationId(newId);
    } finally {
      if (reqId.current === myId) setLoading(false);
    }
  }

  function stop() {
    reqId.current++;
    setLoading(false);
    // preserve the question that was posted so it isn't lost
    if (messages.length) persist(messages, conversationId).then(setConversationId);
  }

  function newConversation() {
    setMessages([]);
    setConversationId(null);
    setHistoryOpen(false);
    setInput("");
  }

  function loadConversation(conv) {
    setConversationId(conv.id);
    setMessages(conv.messages || []);
    setHistoryOpen(false);
  }

  async function deleteConversation(id) {
    try {
      await base44.entities.Conversation.delete(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (id === conversationId) newConversation();
    } catch {}
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100dvh-12rem)] md:h-[calc(100dvh-13rem)] min-h-0">
      <header className="mb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h1 className="font-display text-4xl text-[#2b2620]">Truth Assistant</h1>
            <p className="inline-flex items-center gap-1.5 text-xs text-[#7a2e2e] mt-1">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Forbidden from giving false information, withholding, or steering you.</span>
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={newConversation}
              className="border-[#e8ddc7] text-[#5b5142] hover:bg-[#f0e6d2]"
            >
              <PlusCircle className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setHistoryOpen(true)}
              className="border-[#e8ddc7] text-[#5b5142] hover:bg-[#f0e6d2]"
            >
              <History className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div
        ref={listRef}
        className="flex-1 min-h-0 overflow-y-auto rounded-2xl border border-[#e8ddc7] bg-white/60 p-4 space-y-4"
      >
        {messages.length === 0 && (
          <div className="text-center text-[#8a7f6f] py-16">
            <p className="font-display text-2xl text-[#2b2620] mb-2">Ask a question.</p>
            <p>
              Yes or No is used only when you ask a yes-or-no question. The Assistant reads the meaning
              of every stored writing that belongs to the question, answers from that whole-literature
              understanding, then quotes the passages. King James, Apocrypha, Enoch, Scrolls, fathers,
              Josephus, and the other writings in this app are searched. Nothing is invented or taken
              from the internet.
            </p>
          </div>
        )}
        {messages.map((m, i) => {
          const lastUser = [...messages].reduce((n, row, idx) => (row.role === "user" ? idx : n), -1);
          return (
            <div
              key={i}
              ref={i === lastUser ? turnRef : null}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-2xl px-4 py-3 ${
                  m.role === "user"
                    ? "max-w-[85%] bg-[#2b2620] text-[#f3e9c8]"
                    : "w-full bg-[#f0e6d2] text-[#2b2620]"
                }`}
              >
                {m.role === "assistant" ? (
                  <div className="text-[#3a3328] leading-relaxed space-y-2 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-[#2b2620] [&_h2]:mt-0 [&_h3]:font-display [&_h3]:text-xl [&_h3]:text-[#2b2620] [&_h4]:font-display [&_h4]:text-lg [&_h4]:text-[#7a2e2e] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_a]:text-[#7a2e2e] [&_a]:underline">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                    <StoredWording passages={m.passages} />
                  </div>
                ) : (
                  <p className="leading-relaxed">{m.content}</p>
                )}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#f0e6d2] rounded-2xl px-4 py-3 inline-flex items-center gap-2 text-[#8a7f6f]">
              <Loader2 className="w-4 h-4 animate-spin" /> Reading stored writings. The page stays usable…
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-4 mb-2">
        {SEARCH_CORPORA.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCorpus(item.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
              corpus === item.id
                ? "bg-[#2b2620] text-[#f3e9c8] border-[#2b2620]"
                : "bg-white/70 text-[#5b5142] border-[#e8ddc7]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <form onSubmit={send} className="flex gap-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about any passage, topic, or word…"
          className="flex-1 h-12 bg-white border-[#e8ddc7]"
        />
        {loading ? (
          <Button type="button" onClick={stop} className="h-12 px-5 bg-[#7a2e2e] hover:bg-[#6a2424] text-[#f3e9c8]">
            <Square className="w-4 h-4" fill="currentColor" />
          </Button>
        ) : (
          <Button type="submit" disabled={!input.trim()} className="h-12 px-5 bg-[#2b2620] hover:bg-[#3a3328] text-[#f3e9c8]">
            <Send className="w-4 h-4" />
          </Button>
        )}
      </form>

      <HistoryDialog
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        conversations={conversations}
        loading={historyLoading}
        onLoad={loadConversation}
        onDelete={deleteConversation}
        onNew={newConversation}
      />
    </div>
  );
}