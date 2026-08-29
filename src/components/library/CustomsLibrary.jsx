import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Moon } from "lucide-react";
import { CUSTOMS, CUSTOM_SECTIONS } from "@/data/inheritedCustoms";
import { CUSTOM_INTENT } from "@/data/customIntent";
import { OCCULT_SYMBOLS, SYMBOL_SECTIONS } from "@/data/occultSymbols";
import { ADVERSARY_NAMES, NAME_SECTIONS } from "@/data/adversaryNames";
import { getDossier } from "@/data/originsEvidence";
import BookCard from "./BookCard";
import SymbolPhoto from "./SymbolPhoto";

const mdComponents = {
  h1: ({ node, ...p }) => <h1 className="font-display text-2xl text-[#2b2620] mt-6 mb-3" {...p} />,
  h2: ({ node, ...p }) => <h2 className="font-display text-xl text-[#2b2620] mt-5 mb-2" {...p} />,
  h3: ({ node, ...p }) => <h3 className="font-display text-lg text-[#2b2620] mt-4 mb-2" {...p} />,
  p: ({ node, ...p }) => <p className="text-[#2b2620] leading-relaxed mb-3" {...p} />,
  strong: ({ node, ...p }) => <strong className="text-[#7a2e2e] font-semibold" {...p} />,
  a: ({ node, ...p }) => <a className="text-[#7a2e2e] underline" target="_blank" rel="noopener noreferrer" {...p} />,
  ul: ({ node, ...p }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-[#2b2620]" {...p} />,
  ol: ({ node, ...p }) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-[#2b2620]" {...p} />,
};

function VerseList({ scriptures }) {
  if (!scriptures?.length) return null;
  return (
    <div className="space-y-3 mb-8">
      {scriptures.map((s) => (
        <blockquote key={s.ref} className="p-4 rounded-xl border border-[#e8ddc7] bg-[#f3e9c8]/35">
          <p className="text-sm font-medium text-[#7a2e2e] mb-2">{s.ref}</p>
          <p className="text-[#2b2620] leading-relaxed italic">{s.text}</p>
        </blockquote>
      ))}
    </div>
  );
}

function SourceList({ sources }) {
  if (!sources?.length) return null;
  return (
    <>
      <h2 className="font-display text-xl text-[#2b2620] mb-3">Sources</h2>
      <ul className="list-disc pl-5 space-y-1 text-sm text-[#5b5142]">
        {sources.map((src) => (
          <li key={src}>{src}</li>
        ))}
      </ul>
    </>
  );
}

function OriginBlock({ id }) {
  const d = getDossier(id);
  if (!d) return null;
  return (
    <div className="mb-8">
      <h2 className="font-display text-xl text-[#2b2620] mb-3">Where and when</h2>
      <div className="p-4 rounded-xl border border-[#e8ddc7] bg-white/70 mb-4">
        <p className="text-sm text-[#5b5142] mb-1">
          <span className="uppercase tracking-wide text-xs text-[#b08d3c]">Place</span> — {d.where}
        </p>
        <p className="text-sm text-[#5b5142] mb-3">
          <span className="uppercase tracking-wide text-xs text-[#b08d3c]">Date</span> — {d.when}
        </p>
        <p className="text-[#2b2620] leading-relaxed">{d.summary}</p>
      </div>
      {d.timeline?.length ? (
        <>
          <h3 className="font-display text-lg text-[#2b2620] mb-2">Chronology</h3>
          <ol className="mb-6 space-y-2">
            {d.timeline.map((row) => (
              <li key={`${row.date}-${row.event}`} className="text-sm text-[#2b2620] leading-relaxed pl-1">
                <span className="font-medium text-[#7a2e2e]">{row.date}.</span> {row.event}
              </li>
            ))}
          </ol>
        </>
      ) : null}
      {d.links?.length ? (
        <>
          <h3 className="font-display text-lg text-[#2b2620] mb-2">Empirical evidence (primary, museum, official)</h3>
          <p className="text-xs text-[#8a7f6f] mb-2">
            Links are to university, museum, government, or recognized scholarly editions — not wikis or blogs. Open and
            read the object or text yourself.
          </p>
          <ul className="space-y-2 mb-2">
            {d.links.map((l) => (
              <li key={l.url} className="text-sm leading-relaxed">
                <a href={l.url} className="text-[#7a2e2e] underline" target="_blank" rel="noopener noreferrer">
                  {l.title}
                </a>
                {l.note ? <span className="text-[#5b5142]"> — {l.note}</span> : null}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

function Callout({ label, children, tone = "plain" }) {
  const cls =
    tone === "warn"
      ? "p-4 rounded-xl border border-[#7a2e2e]/30 bg-[#7a2e2e]/8 mb-6"
      : tone === "gold"
        ? "p-4 rounded-xl border border-[#b08d3c]/40 bg-[#f3e9c8]/50 mb-6"
        : "p-4 rounded-xl border border-[#e8ddc7] bg-white/70 mb-6";
  return (
    <div className={cls}>
      <p className="text-xs uppercase tracking-wide text-[#7a2e2e] mb-2">{label}</p>
      {typeof children === "string" ? <p className="text-[#2b2620] leading-relaxed">{children}</p> : children}
    </div>
  );
}

function CustomDetail({ item, onBack }) {
  const intent = CUSTOM_INTENT[item.id];
  const related = (intent?.relatedSymbols || [])
    .map((id) => OCCULT_SYMBOLS.find((s) => s.id === id))
    .filter(Boolean);
  return (
    <div className="max-w-3xl">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-[#7a2e2e] hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> The Way of the Nations
      </button>
      <p className="text-xs uppercase tracking-wide text-[#b08d3c] mb-2">
        {CUSTOM_SECTIONS.find((s) => s.id === item.section)?.title}
      </p>
      <h1 className="font-display text-3xl text-[#2b2620] mb-4">{item.title}</h1>

      <Callout label="Practiced today">{item.practicedToday}</Callout>
      {intent?.originalIntention ? <Callout label="Original intention of the rite" tone="gold">{intent.originalIntention}</Callout> : null}
      {intent?.participationMeans ? (
        <Callout label="What it means when you participate" tone="warn">{intent.participationMeans}</Callout>
      ) : null}
      {intent?.deception ? <Callout label="How the snare works">{intent.deception}</Callout> : null}

      <OriginBlock id={item.id} />

      <h2 className="font-display text-xl text-[#2b2620] mb-3">Scripture</h2>
      <VerseList scriptures={item.scriptures} />

      <h2 className="font-display text-xl text-[#2b2620] mb-3">Documented history</h2>
      <article className="mb-8">
        <ReactMarkdown components={mdComponents}>{item.history}</ReactMarkdown>
      </article>

      <h2 className="font-display text-xl text-[#2b2620] mb-3">Still done without knowing</h2>
      <article className="mb-8">
        <ReactMarkdown components={mdComponents}>{item.unawares}</ReactMarkdown>
      </article>

      {item.disputed ? (
        <div className="p-4 rounded-xl border border-[#7a2e2e]/25 bg-[#7a2e2e]/5 mb-8">
          <p className="text-xs uppercase tracking-wide text-[#7a2e2e] mb-2">Where later claims overreach</p>
          <article>
            <ReactMarkdown components={mdComponents}>{item.disputed}</ReactMarkdown>
          </article>
        </div>
      ) : null}

      {related.length > 0 ? (
        <div className="mb-8">
          <h2 className="font-display text-xl text-[#2b2620] mb-3">Related signs</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {related.map((s) => (
              <Link
                key={s.id}
                to={`/customs/symbol/${s.id}`}
                className="p-3 rounded-xl border border-[#e8ddc7] bg-white/70 hover:border-[#b08d3c]/60"
              >
                <div className="aspect-square mb-2 overflow-hidden rounded-lg">
                  <SymbolPhoto id={s.id} glyph={s.glyph} title={s.title} />
                </div>
                <p className="font-display text-sm text-[#2b2620]">{s.title}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <SourceList sources={item.sources} />
    </div>
  );
}

function SymbolDetail({ item, onBack }) {
  return (
    <div className="max-w-3xl">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-[#7a2e2e] hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> The Way of the Nations
      </button>
      <p className="text-xs uppercase tracking-wide text-[#b08d3c] mb-2">
        {SYMBOL_SECTIONS.find((s) => s.id === item.section)?.title}
      </p>
      <h1 className="font-display text-3xl text-[#2b2620] mb-6">{item.title}</h1>
      <div className="w-full max-w-md aspect-square mb-8 overflow-hidden rounded-2xl border border-[#e8ddc7] shadow-sm">
        <SymbolPhoto id={item.id} glyph={item.glyph} title={item.title} />
      </div>
      <Callout label="Where you still see it">{item.seenToday}</Callout>
      <Callout label="Intention and what participation means" tone="warn">{item.intention}</Callout>
      <OriginBlock id={item.id} />
      <h2 className="font-display text-xl text-[#2b2620] mb-3">Meaning</h2>
      <article className="mb-6">
        <ReactMarkdown components={mdComponents}>{item.meaning}</ReactMarkdown>
      </article>
      <h2 className="font-display text-xl text-[#2b2620] mb-3">History</h2>
      <article className="mb-6">
        <ReactMarkdown components={mdComponents}>{item.history}</ReactMarkdown>
      </article>
      <h2 className="font-display text-xl text-[#2b2620] mb-3">Scripture</h2>
      <VerseList scriptures={item.scriptures} />
      <SourceList sources={item.sources} />
    </div>
  );
}

function NameDetail({ item, onBack }) {
  return (
    <div className="max-w-3xl">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-[#7a2e2e] hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> The Way of the Nations
      </button>
      <p className="text-xs uppercase tracking-wide text-[#b08d3c] mb-2">
        {NAME_SECTIONS.find((s) => s.id === item.section)?.title}
      </p>
      <h1 className="font-display text-3xl text-[#2b2620] mb-4">{item.title}</h1>
      {item.noSigil ? (
        <Callout label="No seal is drawn here" tone="warn">
          Scripture forbids consulting familiar spirits and curious arts (Deuteronomy 18; Acts 19:19). Later grimoires
          attached ranks and diagrams to names. This page identifies the catalog so you can recognize the deception. It
          will not reproduce working sigils.
        </Callout>
      ) : null}
      <Callout label="Who this is">{item.card}</Callout>
      <Callout label="What it means today" tone="warn">{item.meaningToday}</Callout>
      <OriginBlock id={item.id} />
      <h2 className="font-display text-xl text-[#2b2620] mb-3">History</h2>
      <article className="mb-6">
        <ReactMarkdown components={mdComponents}>{item.history}</ReactMarkdown>
      </article>
      <h2 className="font-display text-xl text-[#2b2620] mb-3">Scripture</h2>
      <VerseList scriptures={item.scriptures} />
      <SourceList sources={item.sources} />
    </div>
  );
}

function chipClass(active) {
  return `px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
    active
      ? "bg-[#2b2620] text-[#f3e9c8] border-[#2b2620]"
      : "bg-white/60 text-[#5b5142] border-[#e8ddc7] hover:border-[#b08d3c]/50"
  }`;
}

function SymbolCard({ item, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-stretch text-left whitespace-normal p-4 rounded-2xl border border-[#e8ddc7] bg-white/70 hover:border-[#b08d3c]/60 hover:bg-white transition-colors"
    >
      <div className="aspect-square mb-3 overflow-hidden rounded-lg">
        <SymbolPhoto id={item.id} glyph={item.glyph} title={item.title} />
      </div>
      <span className="font-display text-lg text-[#2b2620] mb-1">{item.title}</span>
      <span className="text-sm text-[#6b6155] leading-relaxed">{item.card}</span>
    </button>
  );
}

export default function CustomsLibrary({ embedded = false, onBack }) {
  const navigate = useNavigate();
  const { customId, symbolId, nameId } = useParams();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");

  const selectedCustom = useMemo(
    () => (customId ? CUSTOMS.find((c) => c.id === customId) || null : null),
    [customId]
  );
  const selectedSymbol = useMemo(
    () => (symbolId ? OCCULT_SYMBOLS.find((s) => s.id === symbolId) || null : null),
    [symbolId]
  );
  const selectedName = useMemo(
    () => (nameId ? ADVERSARY_NAMES.find((n) => n.id === nameId) || null : null),
    [nameId]
  );

  const unknown =
    (Boolean(customId) && !selectedCustom) ||
    (Boolean(symbolId) && !selectedSymbol) ||
    (Boolean(nameId) && !selectedName);

  const q = query.trim().toLowerCase();

  const filteredCustoms = useMemo(() => {
    return CUSTOMS.filter((c) => {
      if (!q) return true;
      const d = getDossier(c.id);
      const hay = [c.title, c.card, c.practicedToday, d?.where, d?.when, d?.summary].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [q]);

  const filteredSymbols = useMemo(() => {
    return OCCULT_SYMBOLS.filter((s) => {
      if (!q) return true;
      const d = getDossier(s.id);
      const hay = [s.title, s.card, s.seenToday, s.meaning, d?.where, d?.when, d?.summary].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [q]);

  const filteredNames = useMemo(() => {
    return ADVERSARY_NAMES.filter((n) => {
      if (!q) return true;
      const d = getDossier(n.id);
      const hay = [n.title, n.card, n.meaningToday, n.history, d?.where, d?.when, d?.summary].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [q]);

  function close() {
    navigate("/customs");
  }

  if (unknown) {
    return (
      <div>
        <button onClick={close} className="inline-flex items-center gap-1.5 text-sm text-[#7a2e2e] hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" /> The Way of the Nations
        </button>
        <p className="text-[#5b5142]">That entry is not in this list.</p>
      </div>
    );
  }
  if (selectedCustom) return <CustomDetail item={selectedCustom} onBack={close} />;
  if (selectedSymbol) return <SymbolDetail item={selectedSymbol} onBack={close} />;
  if (selectedName) return <NameDetail item={selectedName} onBack={close} />;

  const showTraditions = kind === "all" || kind === "traditions";
  const showSymbols = kind === "all" || kind === "symbols";
  const showNames = kind === "all" || kind === "names";
  const searching = Boolean(q);

  return (
    <div>
      {embedded && onBack ? (
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-[#7a2e2e] hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" /> All corpora
        </button>
      ) : null}

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#f3e9c8]/50 text-[#b08d3c]">
            <Moon className="w-5 h-5" />
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-[#2b2620]">The Way of the Nations</h1>
        </div>
        <p className="font-display text-lg text-[#7a2e2e] italic mb-4">
          “Learn not the way of the heathen.” — Jeremiah 10:2
        </p>
        <p className="text-[#5b5142] max-w-3xl leading-relaxed mb-3">
          The enemy does not need a congregation to know his name. Exodus 32 is the pattern: take Egypt&apos;s calf, proclaim a
          feast <em>to the LORD</em>, and dance. The intention of the nations&apos; rites was to honour their gods, the sun, the
          dead, fortune, and fertility. The intention of the later swap was to keep those forms and stamp Messiah&apos;s name on
          them. What it means today, when someone keeps the tradition, is not usually &quot;I chose Satan.&quot; It is that a
          commandment of men has replaced a commandment of God (Mark 7:7–9), the way of the heathen has been learned
          (Jeremiah 10:2), and the conscience is asleep because the label says Christian.
        </p>
        <p className="text-[#5b5142] max-w-3xl leading-relaxed mb-3">
          This section has three doors: the <strong>traditions</strong> still kept, the <strong>signs</strong> still worn and
          printed, and           the <strong>names</strong> Scripture gives the adversary, the gods of the nations, and the Watchers / fallen
          angels. Each entry now carries <strong>where</strong>, <strong>when</strong>, a chronology, and links to
          museum objects, imperial codes, church-father editions, and Scripture — so you can open the evidence yourself.
          Images of the signs are photorealistic photographs of the physical forms. Later grimoires attached seals to
          long lists of spirits; those working diagrams are not reproduced. Acts 19:19 records curious arts burned, not copied for completeness. Completeness of
          the enemy&apos;s catalog is itself a snare.
        </p>
        <p className="text-sm text-[#8a7f6f] max-w-3xl leading-relaxed">
          Deuteronomy 12:30–32 forbids inquiring how the nations served their gods in order to do the same unto the LORD.
          2 Corinthians 11:14: Satan himself is transformed into an angel of light. 1 Thessalonians 5:21: prove all things.
          Where a later writer overreached, that is marked. This is not a manual for any rite.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search traditions, symbols, names…"
          className="flex-1 h-11 px-3 rounded-md bg-white border border-[#e8ddc7] text-[#2b2620] text-sm"
        />
      </div>
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          ["all", "All"],
          ["traditions", "Traditions"],
          ["symbols", "Symbols & sigils"],
          ["names", "Names & fallen angels"],
        ].map(([id, label]) => (
          <button key={id} type="button" onClick={() => setKind(id)} className={chipClass(kind === id)}>
            {label}
          </button>
        ))}
      </div>

      {searching ? (
        <div className="space-y-10">
          {filteredCustoms.length > 0 && showTraditions ? (
            <section>
              <h2 className="font-display text-xl text-[#2b2620] mb-3">Traditions</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCustoms.map((c) => (
                  <BookCard key={c.id} title={c.title} description={c.card} onClick={() => navigate(`/customs/${c.id}`)} />
                ))}
              </div>
            </section>
          ) : null}
          {filteredSymbols.length > 0 && showSymbols ? (
            <section>
              <h2 className="font-display text-xl text-[#2b2620] mb-3">Symbols</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSymbols.map((s) => (
                  <SymbolCard key={s.id} item={s} onClick={() => navigate(`/customs/symbol/${s.id}`)} />
                ))}
              </div>
            </section>
          ) : null}
          {filteredNames.length > 0 && showNames ? (
            <section>
              <h2 className="font-display text-xl text-[#2b2620] mb-3">Names</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNames.map((n) => (
                  <BookCard key={n.id} title={n.title} description={n.card} onClick={() => navigate(`/customs/name/${n.id}`)} />
                ))}
              </div>
            </section>
          ) : null}
          {filteredCustoms.length + filteredSymbols.length + filteredNames.length === 0 ? (
            <p className="text-[#8a7f6f]">Nothing matches that search.</p>
          ) : null}
        </div>
      ) : (
        <>
          {showTraditions
            ? CUSTOM_SECTIONS.map((section) => (
                <section key={section.id} className="mb-10">
                  <h2 className="font-display text-xl text-[#2b2620] mb-1">{section.title}</h2>
                  <p className="text-sm text-[#8a7f6f] mb-4 max-w-3xl">{section.blurb}</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {CUSTOMS.filter((c) => c.section === section.id).map((c) => (
                      <BookCard key={c.id} title={c.title} description={c.card} onClick={() => navigate(`/customs/${c.id}`)} />
                    ))}
                  </div>
                </section>
              ))
            : null}

          {showSymbols
            ? SYMBOL_SECTIONS.map((section) => (
                <section key={section.id} className="mb-10">
                  <h2 className="font-display text-xl text-[#2b2620] mb-1">{section.title}</h2>
                  <p className="text-sm text-[#8a7f6f] mb-4 max-w-3xl">{section.blurb}</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {OCCULT_SYMBOLS.filter((s) => s.section === section.id).map((s) => (
                      <SymbolCard key={s.id} item={s} onClick={() => navigate(`/customs/symbol/${s.id}`)} />
                    ))}
                  </div>
                </section>
              ))
            : null}

          {showNames
            ? NAME_SECTIONS.map((section) => (
                <section key={section.id} className="mb-10">
                  <h2 className="font-display text-xl text-[#2b2620] mb-1">{section.title}</h2>
                  <p className="text-sm text-[#8a7f6f] mb-4 max-w-3xl">{section.blurb}</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ADVERSARY_NAMES.filter((n) => n.section === section.id).map((n) => (
                      <BookCard key={n.id} title={n.title} description={n.card} onClick={() => navigate(`/customs/name/${n.id}`)} />
                    ))}
                  </div>
                </section>
              ))
            : null}
        </>
      )}

      {!embedded ? (
        <p className="text-sm text-[#8a7f6f] mt-4">
          Also listed in the{" "}
          <Link to="/library" className="text-[#7a2e2e] underline">
            Library
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}
