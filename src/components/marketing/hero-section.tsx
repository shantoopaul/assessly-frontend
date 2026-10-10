import { ArrowRight, CheckCircle2, Code2, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const HIGHLIGHTS = [
  "Timed attempts with auto-saved answers",
  "Stripe-backed paid assessments",
  "Full audit trail on every action",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:px-8 lg:py-32">
        {/* Left — copy */}
        <div>
          <p className="inline-flex border bg-card px-3 py-1 text-xs font-semibold tracking-widest text-primary uppercase">
            Developer Assessment Platform
          </p>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Assess developers with{" "}
            <span className="text-primary">structure</span>, not spreadsheets.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Assessly gives candidates a fair, timed assessment experience — and
            gives reviewers and administrators the tools to create, evaluate,
            and audit every step of the process.
          </p>

          <ul className="mt-8 space-y-3">
            {HIGHLIGHTS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <CheckCircle2
                  className="size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/register">
              <Button size="lg">
                Get started free
                <ArrowRight aria-hidden="true" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline">
                See how it works
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            No credit card required · Free assessments supported
          </p>
        </div>

        {/* Right — dashboard mockup */}
        <div className="relative">
          <div className="border bg-card shadow-sm">
            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <span className="size-2.5 rounded-full bg-destructive/60" />
              <span className="size-2.5 rounded-full bg-amber-500/60" />
              <span className="size-2.5 rounded-full bg-green-500/60" />
              <span className="ml-4 font-mono text-xs text-muted-foreground">
                assessly / attempts
              </span>
            </div>

            {/* Mock UI body */}
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                    Active attempt
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    Frontend Developer Assessment
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-xs font-semibold text-primary">
                  <Code2 className="size-3" aria-hidden="true" />
                  42:18
                </span>
              </div>

              <div className="space-y-3 border-t pt-4">
                {[
                  { label: "React fundamentals", value: 100 },
                  { label: "JavaScript deep dive", value: 68 },
                  { label: "Algorithm design", value: 22 },
                ].map((row) => (
                  <div key={row.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {row.label}
                      </span>
                      <span className="font-mono font-medium">
                        {row.value}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${row.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 border-t pt-4 text-center">
                {[
                  { label: "Questions", value: "12" },
                  { label: "Submitted", value: "3" },
                  { label: "Pending", value: "2" },
                ].map((stat) => (
                  <div key={stat.label} className="border bg-muted/30 p-3">
                    <p className="text-lg font-bold">{stat.value}</p>
                    <p className="mt-0.5 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-5 -left-5 hidden items-center gap-2 border bg-background px-4 py-2.5 shadow-sm sm:flex">
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            <span className="text-xs font-semibold">
              Every action audit-logged
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}