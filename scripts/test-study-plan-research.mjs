/**
 * Study-plan research queue + corpus index speed helpers.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { candidateIndexes, indexCorpusRows } from "../src/lib/corpusIndex.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(join(root, "src/lib/studyPlanResearch.js"), "utf8");
assert.match(source, /enqueueStudyResearch/);
assert.match(source, /MAX_PARALLEL/);
assert.match(source, /warmStudyCorpus|prefetchCorpus/);
assert.match(source, /yieldToUi|requestAnimationFrame/);

const planView = readFileSync(join(root, "src/pages/StudyPlanView.jsx"), "utf8");
assert.match(planView, /PAGE_SIZE/);
assert.match(planView, /Further passages/);
assert.match(planView, /runStudyResearch/);
assert.match(planView, /deleteMatching/);
assert.match(planView, /setInterval\(loadAll, 1200\)/);

const myStudy = readFileSync(join(root, "src/pages/MyStudy.jsx"), "utf8");
assert.match(myStudy, /from "@\/lib\/studyPlanResearch"/);
assert.match(myStudy, /warmStudyCorpus/);
assert.match(myStudy, /MAJOR_STUDY_TOPICS/);
assert.match(myStudy, /from "@\/data\/majorStudyTopics"/);
assert.match(myStudy, /Loader2/);
assert.match(myStudy, /Create all \{MAJOR_STUDY_TOPICS\.length\}/);
assert.doesNotMatch(myStudy, /functions\.invoke\("research_topic"/);

const majorTopics = readFileSync(join(root, "src/data/majorStudyTopics.js"), "utf8");
for (const id of ["marriage", "divorce", "tithing", "forgiveness"]) {
  assert.match(majorTopics, new RegExp(`id: "${id}"`));
}

const localFunctions = readFileSync(join(root, "src/api/localFunctions.js"), "utf8");
assert.match(localFunctions, /STUDY_SCRIPTURE_SOURCES/);
assert.match(localFunctions, /STUDY_EXTENDED_SOURCES/);
assert.match(localFunctions, /scriptureFound/);
assert.match(localFunctions, /extendedFound/);
assert.match(localFunctions, /save:\s*false/);

const rows = [
  { text: "For God so loved the world", source: "canon", reference: "John 3:16" },
  { text: "Repent, and be baptized every one of you", source: "canon", reference: "Acts 2:38" },
  { text: "Abraham paid tithes of all", source: "canon", reference: "Hebrews 7:2" },
  { text: "Unrelated fishing story about nets", source: "other", reference: "Extra 1" },
];
const { rows: indexed, index } = indexCorpusRows(rows);
assert.equal(indexed[0].folded.includes("loved"), true);
assert.ok(index.get("baptized")?.length >= 1);
assert.ok(index.get("tithes")?.length >= 1);

const prepared = [
  { exact: false, requirePhrase: false, needles: ["baptized"], foldedPhrase: "" },
  { exact: false, requirePhrase: false, needles: ["tithes"], foldedPhrase: "" },
];
const candidates = candidateIndexes(index, prepared);
assert.equal(candidates.has(1), true);
assert.equal(candidates.has(2), true);
assert.equal(candidates.has(3), false);

const MAX_PARALLEL = 2;
let active = 0;
const waiting = [];
const order = [];
function pump() {
  while (active < MAX_PARALLEL && waiting.length) {
    const job = waiting.shift();
    active += 1;
    Promise.resolve()
      .then(job.run)
      .then(job.resolve, job.reject)
      .finally(() => {
        active -= 1;
        pump();
      });
  }
}
function enqueue(id, ms) {
  return new Promise((resolve, reject) => {
    waiting.push({
      resolve,
      reject,
      run: async () => {
        order.push(`start:${id}`);
        await new Promise((r) => setTimeout(r, ms));
        order.push(`end:${id}`);
      },
    });
    pump();
  });
}

await Promise.all([enqueue("a", 40), enqueue("b", 40), enqueue("c", 10)]);
assert.equal(order[0], "start:a");
assert.equal(order[1], "start:b");
assert.ok(order.indexOf("start:c") > order.indexOf("start:b"));
assert.ok(order.includes("end:a") && order.includes("end:b") && order.includes("end:c"));

console.log("study-plan-research: ok");
