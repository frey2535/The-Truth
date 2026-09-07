import assert from "node:assert/strict";
import { familyHitsText, familyOf } from "../src/lib/wordFamilies.js";
import { learningCannotManipulate, recordAssistantLearning } from "../src/lib/assistantLearn.js";
import { topicTermsFrom } from "../src/lib/questionTopics.js";

const baptism = familyOf("baptism").map((w) => w.toLowerCase());
for (const form of ["baptism", "baptize", "baptized", "baptizing", "baptise", "baptised", "baptising", "baptist"]) {
  assert.ok(baptism.includes(form), `baptism family missing ${form}`);
}
assert.equal(familyHitsText("John did baptize in the wilderness", "baptism"), true);
assert.equal(familyHitsText("and were baptized of him in Jordan", "baptism"), true);
assert.equal(familyHitsText("they were baptising in the river", "baptism"), true);
assert.equal(familyHitsText("Abraham sojourned in the land", "baptism"), false);

assert.deepEqual(topicTermsFrom("What must I do to be saved?"), ["saved"]);
assert.deepEqual(topicTermsFrom("What does the Bible say about baptism?"), ["baptism"]);
assert.ok(topicTermsFrom("Tell me about baptising").includes("baptising"));

const rules = learningCannotManipulate();
assert.equal(rules.mayHidePassages, false);
assert.equal(rules.mayRewriteQuotes, false);
assert.equal(rules.maySteerVerdict, false);
assert.equal(rules.mayAddSearchForms, true);

const mem = {};
globalThis.window = {
  localStorage: {
    getItem: (key) => mem[key] || null,
    setItem: (key, value) => {
      mem[key] = String(value);
    },
  },
};
const learned = recordAssistantLearning({
  topics: ["baptism"],
  passages: [{ text: "and were baptized of him in Jordan, confessing their sins." }],
});
assert.equal(learned.learnedOnlyExpandsRecall, true);
assert.equal(learned.recorded, true);

console.log("assistant understanding ok");
