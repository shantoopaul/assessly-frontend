import { ArrowRight, CheckCircle2, Code2, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Developer assessments made structured",
  description:
    "Assessly helps candidates demonstrate their skills and reviewers manage developer assessments.",
};

const FEATURES = [
  {
    icon: Code2,
    title: "Skill-based assessments",
    description:
      "Organize developer assessments around skills, difficulty, and structured questions.",
  },
  {
    icon: CheckCircle2,
    title: "Track candidate progress",
    description:
      "Give candidates a dedicated workspace for their assessment attempts and results.",
  },
  {
    icon: ShieldCheck,
    title: "Structured review workflows",
    description:
      "Help reviewers evaluate submissions and administrators oversee platform activity.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <p className="inline-flex border bg-card px-3 py-1 text-sm font-medium text-primary">
            Developer Assessment Platform
          </p>

          <h1 className="mt-6 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Make developer assessments more structured.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            A dedicated platform for candidates to demonstrate their skills,
            reviewers to evaluate submissions, and administrators to manage the
            assessment process.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register">
              <Button>
                Get started
                <ArrowRight aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/about-us">
              <Button size="lg" variant="outline">
                Explore Assessly
              </Button>
            </Link>
          </div>
        </div>

        <div className="border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3 border-b pb-5">
            <div className="bg-primary/10 p-3 text-primary">
              <Code2 className="size-6" aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold">One platform, three roles</p>
              <p className="text-sm text-muted-foreground">
                Workflows designed around your responsibilities.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {[
              ["Candidates", "Take assessments and follow results."],
              ["Reviewers", "Create assessments and evaluate attempts."],
              ["Administrators", "Manage users and platform activity."],
            ].map(([title, description]) => (
              <div key={title} className="border p-4">
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Built around the assessment lifecycle
            </h2>
            <p className="mt-3 text-muted-foreground">
              Separate workspaces make it easier to focus on the right tasks.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="border bg-background p-6"
                >
                  <Icon className="size-6 text-primary" aria-hidden="true" />
                  <h3 className="mt-4 font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
