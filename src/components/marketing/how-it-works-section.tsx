import { ClipboardList, PlayCircle, Send, UserCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Step = {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Reviewers author the assessment",
    description:
      "Add MCQ, text, and code questions, set difficulty, duration, and passing score, then publish when ready.",
  },
  {
    number: "02",
    icon: Send,
    title: "Candidates enroll and pay",
    description:
      "Free assessments go straight to READY. Paid ones route through Stripe Checkout before the attempt unlocks.",
  },
  {
    number: "03",
    icon: PlayCircle,
    title: "Attempts run on a live timer",
    description:
      "Answers auto-save as candidates progress, and MCQs are auto-scored the moment they submit.",
  },
  {
    number: "04",
    icon: UserCheck,
    title: "Reviewers evaluate and decide",
    description:
      "Free-form answers are graded with per-question feedback, and the final PASS/FAIL verdict is computed automatically.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-y bg-card scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            From draft to decision in four steps
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Each stage is a first-class state in the system, not a loose label —
            so nothing slips through the cracks.
          </p>
        </div>

        <ol className="mt-12 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => {
            const Icon = step.icon;

            return (
              <li
                key={step.number}
                className="relative bg-card p-6 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold tracking-widest text-primary">
                    {step.number}
                  </span>
                  <Icon
                    className="size-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-6 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
