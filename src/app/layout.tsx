import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import Providers from "@/providers";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Assessly — Developer Assessment Platform",
    template: "%s | Assessly",
  },
  description:
    "Assess developer skills, manage assessments, and review results with Assessly.",
  openGraph: {
    title: "Assessly — Developer Assessment Platform",
    description: "A platform for developer assessments, reviews, and results.",
    siteName: "Assessly",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "oklch(0.514 0.222 16.935)",
};

function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="min-h-screen antialiased">
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;
