import type { Metadata } from "next";
import { HeroSection } from "@/components/marketing/hero-section";

export const metadata: Metadata = {
  title: "Developer assessments made structured",
  description:
    "Assessly helps candidates demonstrate their skills and reviewers manage developer assessments end-to-end — with timed attempts, Stripe payments, and full audit trails.",
  openGraph: {
    title: "Assessly — Developer Assessment Platform",
    description:
      "Structure the entire developer assessment lifecycle: authoring, timed attempts, reviewer grading, and audit-logged decisions.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div>
      <HeroSection />
    </div>
  );
}