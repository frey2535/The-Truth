import { PUBLISHED_APP_URL } from "./appOrigin.js";

export const MCP_PROTOCOL_VERSIONS = ["2025-06-18", "2025-03-26", "2024-11-05"];
export const MCP_PROTOCOL_VERSION = MCP_PROTOCOL_VERSIONS[0];
export const MCP_SERVER_NAME = "the-truth";
export const MCP_SERVER_TITLE = "The Truth";

export function mcpEndpoint(origin = PUBLISHED_APP_URL) {
  const base = String(origin || PUBLISHED_APP_URL).replace(/\/$/, "");
  return `${base}/api/mcp`;
}

export function cursorMcpConfig(url, token = "PASTE_CURSOR_TOKEN") {
  return {
    mcpServers: {
      [MCP_SERVER_NAME]: {
        type: "http",
        url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    },
  };
}

export function cursorMcpSnippet(url, token) {
  return JSON.stringify(cursorMcpConfig(url, token), null, 2);
}

export const APP_PAGES = [
  { path: "/", title: "Home", purpose: "Install and welcome" },
  { path: "/library", title: "Read", purpose: "Catalog of stored texts — listen, or read on the page" },
  { path: "/search", title: "Search", purpose: "Search stored King James, Apocrypha, DSS, Enoch, fathers, Philo, Josephus" },
  { path: "/assistant", title: "Assistant", purpose: "Study questions against in-app texts only" },
  { path: "/word-study", title: "Word Study", purpose: "Define words from stored texts" },
  { path: "/investigate", title: "Investigate", purpose: "Claims checked against stored records" },
  { path: "/evidence", title: "Evidence", purpose: "Published evidence pages" },
  { path: "/prophecy", title: "Prophecy", purpose: "Modern fulfillment notes stored in the app" },
  { path: "/science", title: "Science", purpose: "Scientific confirmation notes stored in the app" },
  { path: "/government", title: "Government", purpose: "Government-document notes stored in the app" },
  { path: "/customs", title: "Customs", purpose: "Inherited customs" },
  { path: "/map", title: "Map", purpose: "Bible map" },
  { path: "/calendar", title: "Calendar", purpose: "Study calendar" },
  { path: "/notebook", title: "Notebook", purpose: "On-device notes — delete, download, print, or listen" },
  { path: "/learn", title: "Learn", purpose: "Study plans" },
  { path: "/install", title: "Install", purpose: "Add the PWA to a phone or computer" },
  { path: "/privacy", title: "Privacy", purpose: "Privacy policy" },
  { path: "/data-safety", title: "Data safety", purpose: "Play data-safety answers" },
  { path: "/play-console", title: "Play Console", purpose: "Every Play Console production answer" },
  { path: "/account", title: "Account", purpose: "Reader account and on-device deletion" },
  { path: "/login", title: "Sign in", purpose: "Reader email/password or Google" },
  { path: "/owner", title: "Platform owner", purpose: "Owner sign-in" },
  { path: "/owner/downloads", title: "Downloads", purpose: "Install counter and Google client ID" },
  { path: "/owner/cursor", title: "Cursor", purpose: "Connect Cursor so an agent can work in this owner app" },
];
