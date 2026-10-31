/** In-app path stack so Back returns to the previous screen inside The Truth. */

const MAX = 50;
const stack = [];

function normalize(path) {
  const raw = String(path || "").trim();
  if (!raw) return "/";
  const noHash = raw.split("#")[0] || "/";
  return noHash.startsWith("/") ? noHash : `/${noHash}`;
}

export function recordNavPath(path) {
  const next = normalize(path);
  if (stack[stack.length - 1] === next) return;
  stack.push(next);
  if (stack.length > MAX) stack.splice(0, stack.length - MAX);
}

/** Drop the current screen and return the previous in-app path (or home). */
export function takePreviousNavPath(fallback = "/") {
  if (stack.length) stack.pop();
  return stack.length ? stack[stack.length - 1] : normalize(fallback);
}

export function canGoBackInApp() {
  return stack.length > 1;
}

export function peekNavStack() {
  return [...stack];
}

export function resetNavHistory() {
  stack.length = 0;
}
