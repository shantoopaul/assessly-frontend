import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/providers";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Assessly - Developer Assessment Platform",
  description: "Your Go To Developer Assessment Platform",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", montserrat.variable)}
    >
      <Providers>
        <body className="min-h-full flex flex-col">{children}</body>
      </Providers>
    </html>
  );
}
