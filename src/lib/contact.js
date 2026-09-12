/** Every public and store email goes to the platform owner Gmail. */
export const CONTACT_EMAIL = "currenflowconsultingllc@gmail.com";

export function reportMailto({ path = "/", title = "The Truth", message = "" } = {}) {
  const page = String(title || "The Truth").trim() || "The Truth";
  const where = String(path || "/");
  const subject = `The Truth report: ${page}`;
  const body = [
    String(message || "").trim() || "(No extra note.)",
    "",
    `Page: ${where}`,
  ].join("\n");
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
