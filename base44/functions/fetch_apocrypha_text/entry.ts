import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Public-domain World English Bible (engwebu) chapters hosted on eBible.org.
const BOOKS: Record<string, { code: string; base: string; title: string }> = {
  additions_esther: { code: 'ESG', base: 'https://ebible.org/engwebu/', title: 'Additions to Esther (Greek Esther)' },
  psalm_151: { code: 'PS2', base: 'https://ebible.org/engwebu/', title: 'Psalm 151' },
  '3_maccabees': { code: '3MA', base: 'https://ebible.org/engwebu/', title: '3 Maccabees' },
  '4_maccabees': { code: '4MA', base: 'https://ebible.org/engwebu/', title: '4 Maccabees' },
};

function stripHtml(html: string): string {
  let s = html.replace(/<head[\s\S]*?<\/head>/gi, ' ');
  s = s.replace(/<script[\s\S]*?<\/script>/gi, ' ');
  s = s.replace(/<style[\s\S]*?<\/style>/gi, ' ');
  s = s.replace(/<a[\s\S]*?<\/a>/gi, ' '); // drop nav links + their text
  s = s.replace(/<hr[^>]*>/gi, '\n');
  s = s.replace(/<br[^>]*>/gi, '\n');
  s = s.replace(/<\/p>/gi, '\n\n');
  s = s.replace(/<[^>]+>/g, ' ');
  s = s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  s = s.replace(/[ \t]+/g, ' ');
  s = s.replace(/\n[ \t]+/g, '\n');
  s = s.replace(/\n{3,}/g, '\n\n');
  const cut = s.search(/This is the updated World English Bible|HTML generated with/i);
  if (cut > 0) s = s.slice(0, cut);
  return s.trim();
}

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const bookId = String(body?.bookId || '');
    const chapter = Math.max(1, parseInt(body?.chapter, 10) || 1);
    const meta = BOOKS[bookId];
    if (!meta) return Response.json({ error: 'Unknown book.' }, { status: 400 });

    const ch = String(chapter).padStart(2, '0');
    const url = `${meta.base}${meta.code}${ch}.htm`;
    const res = await fetch(url);
    if (!res.ok) return Response.json({ error: 'Could not load this chapter.' }, { status: 502 });

    const html = await res.text();
    const text = stripHtml(html);
    const nextCh = String(chapter + 1).padStart(2, '0');
    const hasNext = html.includes(`${meta.code}${nextCh}.htm`);

    return Response.json({ title: meta.title, chapter, text, hasNext, sourceUrl: url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}