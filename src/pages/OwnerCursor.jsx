import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import HeavenBackdrop from "@/components/HeavenBackdrop";
import { publishedApiOrigin } from "@/lib/appOrigin";
import { cursorMcpSnippet, mcpEndpoint } from "@/lib/mcpConfig";
import { useOwner } from "@/lib/OwnerContext";
import { Check, Copy, KeyRound, Loader2, Sparkles } from "lucide-react";

function formatWhen(iso) {
  if (!iso) return "Never used";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function OwnerCursor() {
  const { isOwner, owner, logout } = useOwner();
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("Cursor on this computer");
  const [freshToken, setFreshToken] = useState("");
  const [copied, setCopied] = useState("");
  const endpoint = useMemo(
    () => mcpEndpoint(publishedApiOrigin() || (typeof window !== "undefined" ? window.location.origin : "")),
    []
  );
  const snippet = useMemo(
    () => cursorMcpSnippet(endpoint, freshToken || "PASTE_CURSOR_TOKEN"),
    [endpoint, freshToken]
  );

  useEffect(() => {
    if (!isOwner) return undefined;
    let cancelled = false;
    async function refresh() {
      try {
        const data = await base44.owner.cursorTokens();
        if (!cancelled) {
          setTokens(data.tokens || []);
          setError("");
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load Cursor tokens");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    refresh();
    return () => {
      cancelled = true;
    };
  }, [isOwner]);

  async function createToken(event) {
    event.preventDefault();
    setError("");
    setCreating(true);
    try {
      const data = await base44.owner.createCursorToken(name);
      setFreshToken(data.token || "");
      setTokens(data.tokens || []);
    } catch (err) {
      setError(err.message || "Could not create a Cursor token");
    } finally {
      setCreating(false);
    }
  }

  async function revokeToken(id) {
    setError("");
    try {
      const data = await base44.owner.revokeCursorToken(id);
      setTokens(data.tokens || []);
      setFreshToken("");
    } catch (err) {
      setError(err.message || "Could not revoke that token");
    }
  }

  async function copyText(label, text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      window.setTimeout(() => setCopied(""), 2000);
    } catch {
      setCopied("");
    }
  }

  if (!isOwner) return <Navigate to="/owner" replace />;

  return (
    <div className="min-h-screen truth-app truth-app--auth relative px-4 py-8">
      <HeavenBackdrop />
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#e8c97a]">Platform owner</p>
            <h1 className="font-display text-4xl text-[#f3e9c8]">Cursor</h1>
            <p className="text-sm text-[#f3e9c8]/80 mt-1">{owner.email}</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="h-10 bg-white/90">
              <Link to="/owner/downloads">Downloads</Link>
            </Button>
            <Button type="button" className="h-10 bg-[#7a2e2e] hover:bg-[#5e2222] text-[#f3e9c8]" onClick={logout}>
              Sign out
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e8c97a]/35 bg-[#faf6ef]/92 backdrop-blur-md p-6 mb-5">
          <div className="flex items-start gap-3 mb-3">
            <span className="w-10 h-10 rounded-lg bg-[#f3e9c8] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#7a2e2e]" />
            </span>
            <div>
              <h2 className="font-display text-xl text-[#2b2620]">Work inside this app from Cursor</h2>
              <p className="text-sm text-[#5b5142] mt-1">
                This adds The Truth as a Cursor MCP extension. After you paste the snippet in Cursor
                Settings → MCP, the agent can read downloads, Google sign-in, and the app’s pages
                without leaving Cursor.
              </p>
            </div>
          </div>
          <ol className="list-decimal pl-5 text-sm text-[#2b2620] space-y-2">
            <li>Create a Cursor token below. It is shown once.</li>
            <li>Copy the MCP snippet.</li>
            <li>
              In Cursor, open <span className="font-medium">Settings → Cursor Settings → MCP</span> and
              add a new HTTP server, or put the snippet in <code className="text-xs">.cursor/mcp.json</code>.
            </li>
            <li>Use the live URL for cloud agents. Local Vite only works on this computer.</li>
          </ol>
        </div>

        <div className="rounded-2xl border border-[#e8c97a]/35 bg-[#faf6ef]/92 backdrop-blur-md p-6 mb-5">
          <h2 className="font-display text-xl text-[#2b2620] mb-2">Cursor token</h2>
          <p className="text-sm text-[#5b5142] mb-4">
            Tokens start with <code className="text-xs">mcp_</code>. They are stored hashed. Revoke one
            here if a computer should no longer reach the owner tools.
          </p>
          {error ? <p className="mb-3 text-sm text-[#7a2e2e]">{error}</p> : null}
          <form onSubmit={createToken} className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <label className="text-sm text-[#2b2620]">
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full h-11 rounded-md border border-[#e8ddc7] bg-white px-3"
              />
            </label>
            <Button type="submit" className="h-11 self-end bg-[#2b2620] hover:bg-[#3a3328] text-[#f3e9c8]" disabled={creating}>
              {creating ? "Creating…" : "Create Cursor token"}
            </Button>
          </form>
          {freshToken ? (
            <div className="mt-4 rounded-xl border border-[#e8ddc7] bg-white/80 p-3">
              <p className="text-xs uppercase tracking-wide text-[#8a7f6f] mb-1">Shown once</p>
              <p className="font-mono text-xs break-all text-[#2b2620]">{freshToken}</p>
              <Button
                type="button"
                variant="outline"
                className="mt-3 h-9"
                onClick={() => copyText("token", freshToken)}
              >
                {copied === "token" ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied === "token" ? "Copied" : "Copy token"}
              </Button>
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-[#e8c97a]/35 bg-[#faf6ef]/92 backdrop-blur-md p-6 mb-5">
          <h2 className="font-display text-xl text-[#2b2620] mb-2">MCP endpoint</h2>
          <p className="font-mono text-xs break-all text-[#2b2620] mb-3">{endpoint}</p>
          <pre className="text-[11px] leading-relaxed whitespace-pre-wrap break-all rounded-xl bg-[#2b2620] text-[#f3e9c8] p-4 mb-3">
            {snippet}
          </pre>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="h-10 bg-white" onClick={() => copyText("url", endpoint)}>
              {copied === "url" ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              Copy URL
            </Button>
            <Button type="button" className="h-10 bg-[#2b2620] hover:bg-[#3a3328] text-[#f3e9c8]" onClick={() => copyText("snippet", snippet)}>
              {copied === "snippet" ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              Copy MCP snippet
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e8c97a]/35 bg-[#faf6ef]/92 backdrop-blur-md p-6">
          <h2 className="font-display text-xl text-[#2b2620] mb-4">Issued tokens</h2>
          {loading ? (
            <p className="flex items-center gap-2 text-[#5b5142]">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading tokens…
            </p>
          ) : tokens.length === 0 ? (
            <p className="text-sm text-[#5b5142]">No Cursor tokens yet. Create one above.</p>
          ) : (
            <ul className="space-y-3">
              {tokens.map((row) => (
                <li
                  key={row.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-[#e8ddc7] bg-white/70 p-3"
                >
                  <span className="flex items-start gap-3">
                    <span className="w-9 h-9 rounded-lg bg-[#f3e9c8] flex items-center justify-center shrink-0">
                      <KeyRound className="w-4 h-4 text-[#7a2e2e]" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-[#2b2620]">{row.name}</span>
                      <span className="block text-xs text-[#5b5142]">Created {formatWhen(row.createdAt)}</span>
                      <span className="block text-xs text-[#8a7f6f]">Last used {formatWhen(row.lastUsedAt)}</span>
                    </span>
                  </span>
                  <Button type="button" variant="outline" className="h-9 shrink-0" onClick={() => revokeToken(row.id)}>
                    Revoke
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
