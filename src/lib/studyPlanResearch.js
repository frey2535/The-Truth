import { base44 } from "@/api/base44Client";
import { prefetchCorpus } from "@/lib/localCorpusSearch";

const MAX_PARALLEL = 2;
let active = 0;
const waiting = [];

function yieldToUi() {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(() => setTimeout(resolve, 0));
      return;
    }
    setTimeout(resolve, 0);
  });
}

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

/** Run study-plan corpus research with limited parallelism so Notebook stays usable. */
export function enqueueStudyResearch({ topic, plan_id }) {
  return new Promise((resolve, reject) => {
    waiting.push({
      resolve,
      reject,
      run: async () => {
        await yieldToUi();
        try {
          await base44.functions.invoke("research_topic", {
            topic,
            plan_id,
          });
        } catch {
          /* plan status is updated inside research_topic */
        }
        await yieldToUi();
      },
    });
    pump();
  });
}

export function runStudyResearch(plan, query) {
  if (!plan?.id) return Promise.resolve();
  return enqueueStudyResearch({
    topic: query || plan.study_query || plan.topic,
    plan_id: plan.id,
  });
}

/** Start loading/indexing stored texts before the user creates a plan. */
export function warmStudyCorpus() {
  return prefetchCorpus();
}
