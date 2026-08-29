"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Reading = {
  theme: string;
  scriptureReference: string;
  scriptureText: string;
  christianText: string;
  scientificText: string;
  reflection: string;
  prayer: string;
};

const readings: Reading[] = [
  {
    theme: "Creation",
    scriptureReference: "Genesis 1:1 KJV",
    scriptureText: "In the beginning God created the heaven and the earth.",
    christianText:
      "Christian faith begins with God as Creator. The world is not treated as an accident without meaning, but as a created reality that can be received with gratitude, studied with humility, and stewarded with care.",
    scientificText:
      "Cosmology studies the origin, age, structure, and expansion of the universe. The observable universe contains billions of galaxies, and measurements of cosmic background radiation help scientists reconstruct its earliest moments.",
    reflection:
      "Faith gives creation meaning; science helps describe its order. Both can move the heart toward wonder.",
    prayer:
      "Lord, teach me to see the created world with reverence, curiosity, and responsibility.",
  },
  {
    theme: "Light",
    scriptureReference: "John 1:5 KJV",
    scriptureText:
      "And the light shineth in darkness; and the darkness comprehended it not.",
    christianText:
      "In Christian teaching, light is a sign of Christ, truth, holiness, and hope. Darkness is real, but it does not overcome the light God gives.",
    scientificText:
      "Visible light is one small part of the electromagnetic spectrum. Light behaves in ways that can be measured as waves and particles, and it makes sight, photosynthesis, astronomy, and modern communication possible.",
    reflection:
      "The physical gift of light helps us understand why Scripture uses light to speak about life, guidance, and truth.",
    prayer:
      "Christ, shine your light into my thoughts, choices, and relationships today.",
  },
  {
    theme: "Life",
    scriptureReference: "Psalm 139:14 KJV",
    scriptureText:
      "I will praise thee; for I am fearfully and wonderfully made.",
    christianText:
      "Christian belief honors human life as made by God and worthy of dignity. The body is not disposable; it is part of the person God knows and loves.",
    scientificText:
      "Human bodies are made of trillions of cells working together. DNA stores biological instructions, cells repair damage, and organ systems coordinate through chemical and electrical signals.",
    reflection:
      "The complexity of life can deepen gratitude instead of reducing wonder.",
    prayer:
      "Father, help me honor the life you have given me and the lives of the people around me.",
  },
  {
    theme: "Water",
    scriptureReference: "John 4:14 KJV",
    scriptureText:
      "But whosoever drinketh of the water that I shall give him shall never thirst.",
    christianText:
      "Jesus uses water to describe the life God gives. The image points to renewal, cleansing, and a hope that reaches deeper than physical need.",
    scientificText:
      "Water is essential for known life. Its polarity helps dissolve nutrients, regulate temperature, transport minerals, and support the chemistry inside living cells.",
    reflection:
      "The ordinary need for water helps reveal the deeper spiritual need for God.",
    prayer:
      "Jesus, satisfy what is thirsty in me and make me a source of mercy to others.",
  },
  {
    theme: "Heavens",
    scriptureReference: "Psalm 19:1 KJV",
    scriptureText:
      "The heavens declare the glory of God; and the firmament sheweth his handywork.",
    christianText:
      "The heavens have long called believers to worship. Scripture invites us to look upward and remember that creation is larger than our fears, plans, and pride.",
    scientificText:
      "Stars form from clouds of gas and dust. Inside stars, nuclear fusion releases energy and creates many of the elements later found in planets, oceans, rocks, and living organisms.",
    reflection:
      "The night sky can make human life feel small, but Christian hope says small does not mean forgotten.",
    prayer:
      "Creator God, let the heavens teach me humility, awe, and trust.",
  },
  {
    theme: "Mind",
    scriptureReference: "Romans 12:2 KJV",
    scriptureText:
      "And be not conformed to this world: but be ye transformed by the renewing of your mind.",
    christianText:
      "Christian discipleship includes the renewal of thought, desire, and attention. The mind is trained by what it loves, repeats, and receives as true.",
    scientificText:
      "Neuroscience shows that repeated habits can strengthen neural pathways. Attention, sleep, stress, learning, and relationships all influence how the brain adapts over time.",
    reflection:
      "Spiritual formation and habit formation both remind us that daily attention matters.",
    prayer:
      "Holy Spirit, renew my mind and shape my habits toward truth, love, and wisdom.",
  },
];

const readingPlan = [
  "Read the selected Scripture slowly.",
  "Study the science note without rushing past the wonder.",
  "Write one sentence of gratitude or conviction.",
  "Pray the prompt and carry one thought into the day.",
];

export default function Home() {
  const [selectedTheme, setSelectedTheme] = useState(readings[0].theme);
  const [journal, setJournal] = useState("");

  const selectedReading = useMemo(
    () =>
      readings.find((reading) => reading.theme === selectedTheme) ?? readings[0],
    [selectedTheme]
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fde68a,_transparent_30%),radial-gradient(circle_at_bottom_right,_#bfdbfe,_transparent_35%),linear-gradient(135deg,_#fffdf7,_#f8fafc_55%,_#eef2ff)] px-5 py-6 text-slate-950 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-700 text-lg font-black text-white shadow-sm">
              T
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-amber-700">
                The Truth
              </p>
              <h1 className="text-2xl font-semibold tracking-tight">
                Christian and scientific text side by side
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Scripture</Badge>
            <Badge variant="outline">Science notes</Badge>
            <Badge variant="outline">Prayer journal</Badge>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-between gap-8 rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl sm:p-10">
            <div className="space-y-6">
              <Badge className="bg-white/15 text-white hover:bg-white/20">
                Faith seeking understanding
              </Badge>
              <div className="space-y-4">
                <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                  Read Christian truth with the wonder of God&apos;s creation.
                </h2>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">
                  The Truth pairs Scripture and Christian reflection with clear
                  scientific text about creation, light, life, water, the
                  heavens, and the mind.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["6", "guided themes"],
                ["KJV", "Scripture text"],
                ["1", "daily reflection"],
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
              <CardTitle>Choose a theme</CardTitle>
              <CardDescription>
                Select a topic to read Scripture, Christian reflection, and a
                scientific note together.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {readings.map((reading) => (
                  <Button
                    key={reading.theme}
                    onClick={() => setSelectedTheme(reading.theme)}
                    type="button"
                    variant={
                      selectedTheme === reading.theme ? "default" : "secondary"
                    }
                  >
                    {reading.theme}
                  </Button>
                ))}
              </div>

              <div className="rounded-3xl border bg-amber-50 p-5">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-700">
                  Today&apos;s passage
                </p>
                <h3 className="mt-3 text-2xl font-semibold">
                  {selectedReading.theme}
                </h3>
                <p className="mt-2 text-sm font-medium text-slate-600">
                  {selectedReading.scriptureReference}
                </p>
                <p className="mt-4 text-xl leading-8 text-slate-900">
                  &quot;{selectedReading.scriptureText}&quot;
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Christian text</CardTitle>
              <CardDescription>
                A short reflection rooted in the selected Scripture.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-7 text-slate-700">
                {selectedReading.christianText}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Scientific text</CardTitle>
              <CardDescription>
                A concise science note connected to the theme.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-7 text-slate-700">
                {selectedReading.scientificText}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Reflection</CardTitle>
              <CardDescription>
                Bring faith, reason, and worship into one thought.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base leading-7 text-slate-700">
                {selectedReading.reflection}
              </p>
              <div className="rounded-2xl bg-slate-950 p-4 text-white">
                <p className="text-sm font-medium text-amber-200">Prayer</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {selectedReading.prayer}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Daily reading rhythm</CardTitle>
              <CardDescription>
                A simple pattern for reading The Truth each day.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {readingPlan.map((step, index) => (
                  <li
                    className="flex gap-3 rounded-2xl border bg-white p-4"
                    key={step}
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-700 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-6 text-slate-700">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Prayer journal</CardTitle>
              <CardDescription>
                Save a thought for your own reflection during this session.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                className="min-h-40 resize-none bg-white"
                onChange={(event) => setJournal(event.target.value)}
                placeholder="Write a prayer, question, or insight from today's reading."
                value={journal}
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  {journal.length} character{journal.length === 1 ? "" : "s"} in
                  this note
                </p>
                <Button onClick={() => setJournal("")} type="button" variant="outline">
                  Clear journal
                </Button>
              </div>
              {journal ? (
                <div className="rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
                  Your note is kept locally in this browser session. No account,
                  database, or secret key is required.
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed bg-slate-50 p-4 text-sm leading-6 text-slate-500">
                  Use this space to respond to the reading before moving on.
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
