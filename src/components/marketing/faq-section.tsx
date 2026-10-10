import { Plus } from "lucide-react";

type Faq = {
  question: string;
  answer: string;
};

const FAQS: Faq[] = [
  {
    question: "Do I need to pay to use Assessly?",
    answer:
      "No. Reviewers and admins can create, publish, and manage assessments for free. Candidates only pay a fee when the assessment they enroll in has been configured with one — free assessments skip the payment step entirely.",
  },
  {
    question: "What question types are supported?",
    answer:
      "Three types: MCQ (auto-scored by comparing the response to the correct answer), TEXT (free-form, graded by a reviewer), and CODE (free-form text, graded by a reviewer — no code execution is performed).",
  },
  {
    question: "How are free-form answers scored?",
    answer:
      "Reviewers claim a submitted attempt from the review queue, then grade each text and code answer with a per-question score and optional feedback. The system then computes the final score (0–100) and issues a PASS or FAIL verdict against the assessment's passing score.",
  },
  {
    question: "Can I retake an assessment?",
    answer:
      "Yes. Each enrollment creates a new attempt with its own attempt number, so you can take the same assessment more than once. Previous attempts remain visible in your history with their own scores and feedback.",
  },
  {
    question: "How is payment handled?",
    answer:
      "Payments run through Stripe Checkout. Once a payment succeeds, Stripe sends a signed webhook that flips your attempt from PENDING_PAYMENT to READY, so the assessment unlocks automatically without any manual step.",
  },
  {
    question: "Is there an audit trail of what happens?",
    answer:
      "Every critical action — registration, login, publishing, enrolling, submitting, evaluating, and admin operations like role changes — is written to an audit log that administrators can search and filter from their dashboard.",
  },
];

export function FaqSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            Frequently asked
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Answers to the common questions
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Can&apos;t find what you&apos;re looking for? Reach out on the
            contact page and we&apos;ll get back to you.
          </p>
        </div>

        <div className="divide-y border-t border-b">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-left list-none">
                <span className="font-semibold">{faq.question}</span>
                <Plus
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
