/** Paths the Cloudflare Pages Function should serve as the SPA (index.html). */

export function shouldServeSpa(pathname = "/") {
  const path = String(pathname || "/").split("?")[0] || "/";
  if (path.startsWith("/api/")) return false;
  if (path.startsWith("/corpus/") || path.startsWith("/dss/")) return false;
  if (path.startsWith("/.well-known/")) return false;
  if (path === "/404.html" || path === "/404") return false;
  if (/\.[a-z0-9]{1,8}$/i.test(path) && !path.endsWith(".html")) return false;
  return true;
}

export async function serveSpaIndex(assets, origin) {
  const fetchAsset = (path) => assets.fetch(new URL(path, origin), { method: "GET" });
  let asset = await fetchAsset("/index.html");
  if (asset.status >= 300 && asset.status < 400) {
    asset = await fetchAsset("/");
  }
  const body = await asset.arrayBuffer();
  const type = asset.headers.get("content-type") || "text/html; charset=utf-8";
  return new Response(body, {
    status: 200,
    headers: {
      "content-type": type.includes("text/html") ? "text/html; charset=utf-8" : type,
      "cache-control": "no-store",
    },
  });
}
