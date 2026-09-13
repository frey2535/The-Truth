/** Shrink a one-line header until every control, including Notebook, stays in the bar. */

export function headerOverflows(el, slop = 1) {
  return Boolean(el && el.scrollWidth > el.clientWidth + slop);
}

export function fitHeaderBar(el) {
  if (!el) return 1;
  el.classList.remove("truth-header--icons", "truth-header--tight");
  el.style.setProperty("--truth-header-scale", "1");

  if (headerOverflows(el)) el.classList.add("truth-header--icons");
  if (headerOverflows(el)) el.classList.add("truth-header--tight");

  if (!headerOverflows(el)) return 1;
  const scale = Math.max(0.5, el.clientWidth / el.scrollWidth);
  el.style.setProperty("--truth-header-scale", String(scale));
  return scale;
}
