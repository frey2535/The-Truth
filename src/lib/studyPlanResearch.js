import { base44 } from "@/api/base44Client";

let chain = Promise.resolve();

function yieldToUi() {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(() => setTimeout(resolve, 0));
      return;
    }
    setTimeout(resolve, 0);
  });
}

/** Run study-plan corpus research one plan at a time so Notebook stays responsive. */
export function enqueueStudyResearch({ topic, plan_id }) {
  const job = async () => {
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
  };
  const next = chain.then(job, job);
  chain = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

export function runStudyResearch(plan, query) {
  if (!plan?.id) return Promise.resolve();
  return enqueueStudyResearch({
    topic: query || plan.study_query || plan.topic,
    plan_id: plan.id,
  });
}
