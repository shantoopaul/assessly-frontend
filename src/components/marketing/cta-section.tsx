import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 border bg-background p-8 sm:p-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              Ready when you are
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Start your first assessment in minutes.
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Create a candidate account to try an assessment, or sign in as a
              reviewer to publish one. Demo credentials are available on the
              login page for all three roles.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/register">
              <Button size="lg">
                Get started
                <ArrowRight aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/contact-us">
              <Button size="lg" variant="outline">
                <MessageCircle aria-hidden="true" />
                Talk to us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
