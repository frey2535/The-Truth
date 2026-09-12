import assert from "node:assert/strict";
import { CONTACT_EMAIL, reportMailto } from "../src/lib/contact.js";
import { notebookFilename, notebookItemText } from "../src/lib/notebookExport.js";
import { OWNER_EMAIL_DEFAULT } from "../src/lib/installLedger.js";
import { PLAY_CONTACT_EMAIL } from "../src/lib/playConsole.js";

assert.equal(CONTACT_EMAIL, "currenflowconsultingllc@gmail.com");
assert.equal(OWNER_EMAIL_DEFAULT, CONTACT_EMAIL);
assert.equal(PLAY_CONTACT_EMAIL, CONTACT_EMAIL);

const mail = reportMailto({
  path: "/library",
  title: "Read",
  message: "A verse did not load.",
});
assert.match(mail, new RegExp(`^mailto:${CONTACT_EMAIL}\\?`));
assert.match(mail, /subject=/);
assert.match(decodeURIComponent(mail), /Page: \/library/);
assert.match(decodeURIComponent(mail), /A verse did not load/);

const note = notebookItemText("Note", {
  reference: "John 8:32",
  topic: "truth",
  text: "and the truth shall make you free",
  body: "My note",
});
assert.match(note, /John 8:32/);
assert.match(note, /My note/);
assert.equal(notebookFilename("Note", { reference: "John 8:32" }), "john-8-32.txt");

console.log("notebook print and report ok");
