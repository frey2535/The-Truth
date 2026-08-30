/** Put the reading surface at the start of the selected text. */
export function scrollReadingToTop() {
  const instant = { top: 0, left: 0, behavior: "instant" };
  window.scrollTo(instant);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  const main = document.querySelector("main");
  if (main) main.scrollTop = 0;
}
