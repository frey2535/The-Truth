"use client";

import { FormEvent, useMemo, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

type Assessment = {
  score: number;
  verdict: string;
  summary: string;
  signals: string[];
  nextSteps: string[];
};

const exampleClaims = [
  "A city audit found that bus delays dropped 18 percent after the new signal priority program launched in March.",
  "Everyone knows the new supplement cures brain fog in two days.",
  "The state education report says third-grade reading scores rose in districts that added summer tutoring.",
];

const reviewQueue = [
  {
    claim: "Public transit pilot reduced downtown commute times.",
    status: "Source requested",
  },
  {
    claim: "New water rules cut household usage in pilot neighborhoods.",
    status: "Ready for review",
  },
  {
    claim: "Viral post misquoted the health department guidance.",
    status: "Needs context",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function assessClaim(claim: string, sources: string): Assessment {
  const words = claim.trim().split(/\s+/).filter(Boolean);
  const sourceItems = sources
    .split(/[\n,]/)
    .map((source) => source.trim())
    .filter(Boolean);
  const lowerClaim = claim.toLowerCase();
  const joinedSources = sourceItems.join(" ").toLowerCase();

  let score = 24;
  const signals: string[] = [];
  const nextSteps = [
    "Trace the claim back to the original report, data table, interview, or recording.",
    "Find an independent source that can confirm or challenge the same point.",
    "Separate the verified fact from any interpretation or opinion around it.",
  ];

  if (words.length >= 18) {
    score += 14;
    signals.push("The claim has enough detail to investigate.");
  } else {
    nextSteps.push("Add who, what, where, and when so the claim can be checked.");
  }

  if (/\d|percent|million|billion|january|february|march|april|may|june|july|august|september|october|november|december/.test(lowerClaim)) {
    score += 16;
    signals.push("Specific numbers or dates make the claim more testable.");
  } else {
    nextSteps.push("Look for measurable figures or a clear date range.");
  }

  if (/[A-Z][a-z]+(?:\s[A-Z][a-z]+)?/.test(claim)) {
    score += 8;
    signals.push("Named people, places, or organizations are present.");
  }

  if (sourceItems.length > 0) {
    score += Math.min(sourceItems.length * 8, 24);
    signals.push(`${sourceItems.length} source note${sourceItems.length === 1 ? "" : "s"} attached.`);
  } else {
    nextSteps.push("Attach at least one source link, citation, or reporting note.");
  }

  if (/(doi|\.gov|\.edu|who\.int|cdc\.gov|pubmed|journal|reuters|apnews|audit|report)/.test(joinedSources)) {
    score += 12;
    signals.push("At least one source appears to be primary or reputable.");
  }

  if (/(always|never|everyone knows|secret|shocking|miracle|proves|they do not want you to know)/.test(lowerClaim)) {
    score -= 18;
    signals.push("Loaded or absolute language needs extra scrutiny.");
    nextSteps.push("Replace emotional framing with the exact factual assertion.");
  }

  const finalScore = clamp(score, 5, 96);

  if (finalScore >= 75) {
    return {
      score: finalScore,
      verdict: "Ready for review",
      summary:
        "This claim is specific and sourced enough for a reviewer to begin checking evidence.",
      signals,
      nextSteps,
    };
  }

  if (finalScore >= 55) {
    return {
      score: finalScore,
      verdict: "Promising lead",
      summary:
        "There is a checkable core here, but the evidence package still needs support.",
      signals,
      nextSteps,
    };
  }

  return {
    score: finalScore,
    verdict: "Needs evidence",
    summary:
      "The claim needs more specificity or sourcing before it can be responsibly labeled true or false.",
    signals,
    nextSteps,
  };
}

export default function Home() {
  const [claim, setClaim] = useState("");
  const [sources, setSources] = useState("");
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [error, setError] = useState("");

  const wordCount = useMemo(
    () => claim.trim().split(/\s+/).filter(Boolean).length,
    [claim]
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (wordCount < 8) {
      setAssessment(null);
      setError("Add a fuller claim before running a truth check.");
      return;
    }

    setError("");
    setAssessment(assessClaim(claim, sources));
  }

  function loadExample(example: string) {
    setClaim(example);
    setSources("City audit report, March 2026\nLocal newsroom follow-up");
    setError("");
    setAssessment(null);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#e0f2fe,_transparent_34%),linear-gradient(135deg,_#f8fafc,_#eef2ff_45%,_#fff7ed)] px-5 py-6 text-slate-950 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white">
              T
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
                The Truth
              </p>
              <h1 className="text-2xl font-semibold tracking-tight">
                Evidence-first claim checks
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Local analysis</Badge>
            <Badge variant="outline">No account needed</Badge>
            <Badge variant="outline">Reviewer ready</Badge>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-between gap-6 rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl sm:p-10">
            <div className="space-y-6">
              <Badge className="bg-white/15 text-white hover:bg-white/20">
                First usable slice
              </Badge>
              <div className="space-y-4">
                <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                  Turn a claim into a transparent verification brief.
                </h2>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">
                  The Truth helps reporters, researchers, and community teams
                  decide whether a statement is specific, sourced, and ready for
                  human review.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["3", "signal checks"],
                ["0", "external API calls"],
                ["1", "review brief"],
              ].map(([value, label]) => (
                <div
                  className="rounded-2xl border border-white/10 bg-white/10 p-4"
                  key={label}
                >
                  <p className="text-3xl font-semibold">{value}</p>
                  <p className="text-sm text-slate-300">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-white/80 bg-white/90 shadow-xl backdrop-blur">
            <CardHeader>
              <CardTitle>Run a truth check</CardTitle>
              <CardDescription>
                Paste a factual claim and add any source links or notes you
                already have.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="claim">
                    Claim
                  </label>
                  <Textarea
                    className="min-h-32 resize-none bg-white"
                    id="claim"
                    onChange={(event) => setClaim(event.target.value)}
                    placeholder="Example: A city audit found bus delays dropped 18 percent after signal priority launched in March."
                    value={claim}
                  />
                  <p className="text-xs text-slate-500">
                    {wordCount} word{wordCount === 1 ? "" : "s"} entered
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="sources">
                    Sources or notes
                  </label>
                  <Input
                    className="bg-white"
                    id="sources"
                    onChange={(event) => setSources(event.target.value)}
                    placeholder="Paste URLs, report names, or reporting notes"
                    value={sources}
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button className="sm:flex-1" type="submit">
                    Generate review brief
                  </Button>
                  <Button
                    className="sm:flex-1"
                    onClick={() => {
                      setClaim("");
                      setSources("");
                      setAssessment(null);
                      setError("");
                    }}
                    type="button"
                    variant="outline"
                  >
                    Clear
                  </Button>
                </div>
              </form>

              <div className="mt-5 flex flex-wrap gap-2">
                {exampleClaims.map((example, index) => (
                  <Button
                    key={example}
                    onClick={() => loadExample(example)}
                    size="sm"
                    type="button"
                    variant="secondary"
                  >
                    Example {index + 1}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Claim is too short</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Review brief</CardTitle>
              <CardDescription>
                Your result appears here after a truth check.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assessment ? (
                <div className="space-y-6">
                  <div className="rounded-3xl border bg-slate-50 p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-500">
                          Evidence readiness
                        </p>
                        <p className="text-4xl font-semibold">
                          {assessment.score}%
                        </p>
                      </div>
                      <Badge
                        variant={
                          assessment.score >= 75
                            ? "default"
                            : assessment.score >= 55
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {assessment.verdict}
                      </Badge>
                    </div>
                    <Progress value={assessment.score} />
                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {assessment.summary}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="mb-3 font-medium">Positive signals</h3>
                      <ul className="space-y-2 text-sm text-slate-600">
                        {(assessment.signals.length
                          ? assessment.signals
                          : ["No strong verification signals found yet."]
                        ).map((signal) => (
                          <li
                            className="rounded-2xl bg-emerald-50 px-3 py-2 text-emerald-950"
                            key={signal}
                          >
                            {signal}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="mb-3 font-medium">Next verification steps</h3>
                      <ul className="space-y-2 text-sm text-slate-600">
                        {assessment.nextSteps.slice(0, 4).map((step) => (
                          <li
                            className="rounded-2xl bg-amber-50 px-3 py-2 text-amber-950"
                            key={step}
                          >
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed bg-slate-50 p-8 text-center">
                  <p className="text-lg font-medium">No brief generated yet</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Add a claim above to see an evidence-readiness score,
                    verification signals, and a reviewer checklist.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Review queue</CardTitle>
                <CardDescription>
                  A simple view of claims moving through verification.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {reviewQueue.map((item) => (
                  <div
                    className="rounded-2xl border bg-white p-4"
                    key={item.claim}
                  >
                    <p className="font-medium leading-6">{item.claim}</p>
                    <Badge className="mt-3" variant="outline">
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Method</CardTitle>
                <CardDescription>
                  The app does not declare truth automatically.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-6 text-slate-600">
                <p>
                  The Truth scores whether a claim is ready to be verified by a
                  person. It rewards specificity, source notes, primary-source
                  clues, and measurable language.
                </p>
                <p>
                  It lowers readiness for vague claims, missing sources, and
                  emotional or absolute language. The result is a triage brief,
                  not a final verdict.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
