import type { ReactNode } from "react";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}
