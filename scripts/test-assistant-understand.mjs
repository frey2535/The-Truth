import assert from "node:assert/strict";
import {
  buildAssistantAnswer,
  extraSearchesForKind,
  isYesNoQuestion,
  questionKind,
  verseRelatedToQuestion,
  writeAssistantAnswer,
  yesNoOpening,
} from "../src/lib/assistantAnswer.js";
import { understandLiterature } from "../src/lib/literatureMeaning.js";
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
assert.deepEqual(topicTermsFrom("Is baptism required for salvation?").sort(), ["baptism", "salvation"]);

assert.equal(isYesNoQuestion("Is baptism required for salvation?"), true);
assert.equal(isYesNoQuestion("Must I be baptized to be saved?"), true);
assert.equal(isYesNoQuestion("What must I do to be saved?"), false);
assert.equal(isYesNoQuestion("How can I be saved?"), false);
assert.equal(questionKind("What must I do to be saved?", ["saved"]), "salvation-duty");
assert.equal(questionKind("Is baptism required for salvation?", ["baptism", "salvation"]), "baptism-salvation");
assert.ok(extraSearchesForKind("salvation-duty").includes("everlasting life"));
assert.ok(extraSearchesForKind("baptism-salvation").includes("baptized into"));
assert.ok(extraSearchesForKind("salvation-duty").includes("born of water"));

const savedAsk = {
  question: "What must I do to be saved?",
  topics: ["saved"],
  words: ["saved"],
  yesNo: false,
  kind: "salvation-duty",
  extraSearches: extraSearchesForKind("salvation-duty"),
};
assert.equal(isYesNoQuestion(savedAsk.question), false);
assert.ok(savedAsk.extraSearches.includes("believe"));

const baptismAsk = {
  question: "Is baptism required for salvation?",
  topics: ["baptism", "salvation"],
  words: ["baptism", "salvation"],
  yesNo: true,
  kind: "baptism-salvation",
  extraSearches: extraSearchesForKind("baptism-salvation"),
};
assert.equal(isYesNoQuestion(baptismAsk.question), true);

const samples = [
  { source: "canon", book: "John", chapter: 3, verse: 15, reference: "John 3:15", text: "That whosoever believeth in him should not perish, but have eternal life." },
  { source: "canon", book: "John", chapter: 3, verse: 16, reference: "John 3:16", text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
  { source: "canon", book: "John", chapter: 3, verse: 5, reference: "John 3:5", text: "Jesus answered, Verily, verily, I say unto thee, Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God." },
  { source: "canon", book: "Mark", chapter: 16, verse: 16, reference: "Mark 16:16", text: "He that believeth and is baptized shall be saved; but he that believeth not shall be damned." },
  { source: "canon", book: "Acts", chapter: 2, verse: 38, reference: "Acts 2:38", text: "Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost." },
  { source: "canon", book: "Acts", chapter: 2, verse: 21, reference: "Acts 2:21", text: "And it shall come to pass, that whosoever shall call on the name of the Lord shall be saved." },
  { source: "canon", book: "Romans", chapter: 6, verse: 3, reference: "Romans 6:3", text: "Know ye not, that so many of us as were baptized into Jesus Christ were baptized into his death?" },
  { source: "canon", book: "1 Peter", chapter: 3, verse: 21, reference: "1 Peter 3:21", text: "The like figure whereunto even baptism doth also now save us (not the putting away of the filth of the flesh, but the answer of a good conscience toward God,) by the resurrection of Jesus Christ:" },
  { source: "canon", book: "Matthew", chapter: 7, verse: 21, reference: "Matthew 7:21", text: "Not every one that saith unto me, Lord, Lord, shall enter into the kingdom of heaven; but he that doeth the will of my Father which is in heaven." },
  { source: "canon", book: "2 Thessalonians", chapter: 1, verse: 8, reference: "2 Thessalonians 1:8", text: "In flaming fire taking vengeance on them that know not God, and that obey not the gospel of our Lord Jesus Christ:" },
  { source: "canon", book: "Romans", chapter: 10, verse: 9, reference: "Romans 10:9", text: "That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved." },
  { source: "canon", book: "Ephesians", chapter: 2, verse: 8, reference: "Ephesians 2:8", text: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God:" },
  { source: "canon", book: "1 Samuel", chapter: 14, verse: 23, reference: "1 Samuel 14:23", text: "So the LORD saved Israel that day: and the battle passed over unto Beth-aven. And the Philistines were smitten." },
];
const relatedSamples = samples.slice(0, 12);
const battle = samples[12];
for (const row of relatedSamples) {
  assert.equal(verseRelatedToQuestion(row, baptismAsk), true, `should keep ${row.reference}`);
}
assert.equal(verseRelatedToQuestion(battle, savedAsk), false);

const openAnswer = writeAssistantAnswer("What must I do to be saved?", samples, savedAsk);
assert.equal(/\*\*Yes\.\*\*/.test(openAnswer), false);
assert.equal(/\*\*No\.\*\*/.test(openAnswer), false);
assert.match(openAnswer, /### Understanding of the literature/);
assert.match(openAnswer, /### Answer/);
assert.match(openAnswer, /### All stored wording/);
assert.match(openAnswer, /How the whole literature reads together/);
assert.match(openAnswer, /Believe on the Lord/);
assert.match(openAnswer, /Be baptized/);
assert.match(openAnswer, /John 3:15/);
assert.match(openAnswer, /John 3:16/);
assert.match(openAnswer, /Mark 16:16/);
assert.match(openAnswer, /Acts 2:38/);
assert.match(openAnswer, /1 Peter 3:21/);
assert.match(openAnswer, /Matthew 7:21/);
assert.match(openAnswer, /2 Thessalonians 1:8/);
assert.doesNotMatch(openAnswer, /1 Samuel 14:23/);

const yn = yesNoOpening(baptismAsk, relatedSamples);
assert.match(yn, /\*\*Yes\.\*\*/);
assert.doesNotMatch(yn, /do not speak with one wording/);

const baptismAnswer = writeAssistantAnswer("Is baptism required for salvation?", samples, baptismAsk);
assert.match(baptismAnswer, /\*\*Yes\.\*\*/);
assert.match(baptismAnswer, /Understanding of the literature/);
assert.match(baptismAnswer, /John 3:16/);
assert.match(baptismAnswer, /Mark 16:16/);
assert.match(baptismAnswer, /1 Peter 3:21/);
assert.match(baptismAnswer, /Romans 6:3/);
assert.match(baptismAnswer, /Acts 2:21/);
assert.match(baptismAnswer, /required for salvation/);
assert.doesNotMatch(baptismAnswer, /do not speak with one wording/);

const reading = understandLiterature(relatedSamples, baptismAsk);
assert.equal(reading.verdict, "Yes");
assert.ok(reading.tied.length >= 4);
assert.ok(reading.believeWithoutBaptism.length >= 1);

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

const built = buildAssistantAnswer("What must I do to be saved?", samples, savedAsk);
assert.match(built.markdown, /Understanding of the literature/);
assert.ok(built.related.some((row) => row.reference === "John 3:16"));
assert.doesNotMatch(built.markdown, /baptism doth also now save us/);
assert.match(writeAssistantAnswer("What must I do to be saved?", samples, savedAsk), /baptism doth also now save us/);

console.log("assistant understanding ok");
