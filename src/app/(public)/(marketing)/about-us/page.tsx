import { ArrowRight, ClipboardCheck, Code2, ShieldCheck, Target, Users, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Learn how Assessly makes developer assessments more structured, fair, and auditable for candidates, reviewers, and administrators.",
  openGraph: {
    title: "About Assessly — Developer Assessment Platform",
    description:
      "A structured developer assessment platform with dedicated workspaces for candidates, reviewers, and administrators.",
    type: "website",
  },
};

const ROLES = [
  {
    icon: Code2,
    title: "Candidates",
    description:
      "Browse published assessments, enroll in free or paid attempts, complete timed sessions, and follow results in a dedicated workspace.",
    href: "/register",
    cta: "Create an account",
  },
  {
    icon: ClipboardCheck,
    title: "Reviewers",
    description:
      "Author assessments with MCQ, text, and code questions, publish them, then claim and grade candidate submissions from a review queue.",
    href: "/login",
    cta: "Sign in as reviewer",
  },
  {
    icon: ShieldCheck,
    title: "Administrators",
    description:
      "Manage users and roles, oversee published assessments, monitor platform activity, and inspect every critical action via audit logs.",
    href: "/login",
    cta: "Sign in as admin",
  },
];

const VALUES = [
  {
    icon: Target,
    title: "Structure over improvisation",
    description:
      "Every workflow is modelled around clear states and rules — from DRAFT to PUBLISHED assessments and from enrollment to EVALUATED attempts.",
  },
  {
    icon: Zap,
    title: "Fairness at scale",
    description:
      "Timed attempts, auto-scored MCQs, and reviewer-graded free-form answers produce consistent outcomes across every candidate.",
  },
  {
    icon: Users,
    title: "Built for three perspectives",
    description:
      "Candidates, reviewers, and administrators each get a focused workspace tailored to the responsibilities of their role.",
  },
  {
    icon: ShieldCheck,
    title: "Traceable by design",
    description:
      "Soft deletes and audit logs keep the entire assessment lifecycle transparent, reversible, and accountable.",
  },
];

const STATS = [
  { value: "3", label: "Distinct roles" },
  { value: "100%", label: "Audited actions" },
  { value: "Timed", label: "Attempt windows" },
  { value: "Stripe", label: "Secure payments" },
];

const AboutUsPage = () => {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-3xl">
          <p className="inline-flex border bg-card px-3 py-1 text-sm font-medium text-primary">
            About Assessly
          </p>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            A more structured way to assess developers.
          </h1>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Assessly brings candidates, reviewers, and administrators into one
            coordinated platform. Instead of scattered forms and manual
            scoring, every step — from enrollment to evaluation — is captured,
            scored, and auditable.
          </p>
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Our mission
            </h2>

            <p className="mt-4 leading-7 text-muted-foreground">
              Hiring and upskilling decisions deserve more than a take-home
              PDF. We built Assessly so teams can run developer assessments
              that are consistent, fair, and easy to audit — while giving
              candidates a focused, transparent experience from enrollment to
              results.
            </p>

            <p className="mt-4 leading-7 text-muted-foreground">
              Every assessment is structured around real difficulty levels,
              timed attempts, and reviewer oversight. Payments are handled
              through Stripe, and everything that matters is written to an
              audit log so administrators can see exactly what happened and
              when.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="border bg-background p-5">
                <p className="text-2xl font-bold tracking-tight text-primary">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            One platform, three workspaces
          </h2>
          <p className="mt-3 text-muted-foreground">
            Each role gets a focused set of tools for their responsibilities.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {ROLES.map((role) => {
            const Icon = role.icon;

            return (
              <article
                key={role.title}
                className="flex flex-col border bg-card p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </div>

                <h3 className="mt-5 font-semibold">{role.title}</h3>

                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                  {role.description}
                </p>

                <Link
                  href={role.href}
                  className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  {role.cta}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              What we care about
            </h2>
            <p className="mt-3 text-muted-foreground">
              The principles that shape every workflow in Assessly.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {VALUES.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.title}
                  className="border bg-background p-6"
                >
                  <Icon className="size-6 text-primary" aria-hidden="true" />
                  <h3 className="mt-4 font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 border bg-card p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Ready to see Assessly in action?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Create a candidate account or sign in with a demo role from the
              login page to explore the full workflow end to end.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/register">
              <Button>
                Get started
                <ArrowRight aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/contact-us">
              <Button variant="outline">Contact us</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;