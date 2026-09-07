/** Prefix a stored public path with Vite's base (needed on GitHub Pages). */
export function publicUrl(path) {
  if (!path) return path;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  const base = import.meta.env.BASE_URL || "/";
  if (base !== "/" && path.startsWith(base)) return path;
  return `${base}${String(path).replace(/^\//, "")}`;
}

/** Login page href, including the GitHub Pages base path when needed. */
export function loginUrl() {
  return publicUrl("/login");
}
