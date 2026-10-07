import { GitFork, Mail, MapPin, MessageSquare } from "lucide-react";
import type { Metadata } from "next";

import { ContactForm } from "@/components/shared/contact-form";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Reach out to the Assessly team with questions about developer assessments, reviews, or platform access.",
  openGraph: {
    title: "Contact Assessly — Developer Assessment Platform",
    description:
      "Get in touch with the Assessly team for support, feedback, or partnership inquiries.",
    type: "website",
  },
};

const SUPPORT_EMAIL = "shantoopaul@gmail.com";

const CONTACT_CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}`,
    description: "General inquiries and support requests.",
  },
  {
    icon: GitFork,
    label: "Source",
    value: "github.com/assessly",
    href: "https://github.com/",
    description: "Report bugs, request features, or browse the code.",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Remote-first",
    href: null,
    description: "Our team is distributed across multiple time zones.",
  },
] as const;

const ContactUsPage = () => {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-3xl">
          <p className="inline-flex border bg-card px-3 py-1 text-sm font-medium text-primary">
            Contact Assessly
          </p>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Let&apos;s talk about your assessment workflow.
          </h1>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Whether you have a question about the platform, need help with an
            integration, or want to share feedback — the Assessly team is here
            to help.
          </p>
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          {CONTACT_CHANNELS.map((channel) => {
            const Icon = channel.icon;
            const inner = (
              <>
                <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {channel.label}
                </p>
                <p className="mt-1 font-semibold break-all">{channel.value}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {channel.description}
                </p>
              </>
            );

            return channel.href ? (
              <a
                key={channel.label}
                href={channel.href}
                className="block border bg-background p-6 transition-colors hover:border-primary/50 hover:bg-muted/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {inner}
              </a>
            ) : (
              <div key={channel.label} className="border bg-background p-6">
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
              <MessageSquare className="size-5" aria-hidden="true" />
            </div>

            <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
              Send us a message
            </h2>

            <p className="mt-3 max-w-xl text-muted-foreground">
              Fill in the form and we&apos;ll get back to you as soon as we can.
              For urgent issues, reach us directly at{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-semibold text-primary hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
              .
            </p>

            <div className="mt-6 border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Response time
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                We typically respond within one business day. For partnership or
                enterprise inquiries, mention it in the subject line so we can
                route your message to the right team.
              </p>
            </div>
          </div>

          <div className="border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold tracking-tight">
              Contact form
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              All fields are required.
            </p>

            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;
