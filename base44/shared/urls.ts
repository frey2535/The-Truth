// Shared URL validation for research engines. Ensures links point directly at a
// specific document, article, or PDF — never a search engine, homepage, portal,
// or search/query page. Returns '' for anything that is not a direct document link.

const SEARCH_ENGINES = /(?:^|\.)(?:google|bing|duckduckgo|yahoo|baidu|yandex|ask|aol|ecosia|startpage|qwant|dogpile)\./i;
const SEARCH_PATH = /\/(?:search|searchapp|find|results?|query|listing|index|home|landing|browse|portal)(?:\/|$)/i;
const SEARCH_QUERY = /(?:^|&)(?:q|query|search|searchterm|searchTerm|keyword|keywords|text)=/i;
// FOIA / archive library listing pages (e.g. foia.state.gov/FOIALIBRARY/Logs2.aspx) are
// portals, not documents. Reject unless the path ends in a direct file (.pdf/.doc/.docx).
const LIBRARY_LISTING = /\/foialibrary\//i;
const GENERIC_LISTING = /\/(?:logs\d?|default|index|search|results|main|home|landing)\.(?:aspx|html?|php|jsp)(?:$|[/?#])/i;
const DIRECT_FILE = /\.(?:pdf|docx?|xlsx?|pptx?|tif{1,2}|jpg|jpeg|png|gif)$/i;

export function cleanDirectUrl(raw: string): string {
  const url = String(raw || '').trim();
  if (!url) return '';
  let parsed: URL;
  try { parsed = new URL(url); } catch { return ''; }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
  if (SEARCH_ENGINES.test(parsed.hostname)) return '';
  const path = parsed.pathname.replace(/\/+$/, '');
  if (!path) return '';
  if (SEARCH_PATH.test(parsed.pathname)) return '';
  if (SEARCH_QUERY.test(parsed.search)) return '';
  if (GENERIC_LISTING.test(parsed.pathname)) return '';
  if (LIBRARY_LISTING.test(parsed.pathname) && !DIRECT_FILE.test(parsed.pathname)) return '';
  return url;
}