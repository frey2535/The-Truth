/**
 * Ensures study-plan research jobs run one at a time (mirrors studyPlanResearch.js).
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(join(root, "src/lib/studyPlanResearch.js"), "utf8");
assert.match(source, /enqueueStudyResearch/);
assert.match(source, /chain = chain\.then|chain = next/);
assert.match(source, /yieldToUi|requestAnimationFrame/);

const planView = readFileSync(join(root, "src/pages/StudyPlanView.jsx"), "utf8");
assert.match(planView, /PAGE_SIZE/);
assert.match(planView, /Further passages/);
assert.match(planView, /runStudyResearch/);
assert.match(planView, /deleteMatching/);

const myStudy = readFileSync(join(root, "src/pages/MyStudy.jsx"), "utf8");
assert.match(myStudy, /from "@\/lib\/studyPlanResearch"/);
assert.doesNotMatch(myStudy, /functions\.invoke\("research_topic"/);

let chain = Promise.resolve();
const order = [];
function enqueue(id, ms) {
  const job = async () => {
    order.push(`start:${id}`);
    await new Promise((r) => setTimeout(r, ms));
    order.push(`end:${id}`);
  };
  const next = chain.then(job, job);
  chain = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

await Promise.all([enqueue("a", 30), enqueue("b", 10), enqueue("c", 5)]);
assert.deepEqual(order, ["start:a", "end:a", "start:b", "end:b", "start:c", "end:c"]);

console.log("study-plan-research: ok");
