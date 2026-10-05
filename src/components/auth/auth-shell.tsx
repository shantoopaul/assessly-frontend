import Link from "next/link";
import type { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="border bg-card p-6 sm:p-8">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-primary"
        >
          Assessly
        </Link>

        <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>

        <div className="mt-8">{children}</div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        By continuing you agree to our terms and privacy policy.
      </p>
    </div>
  );
}
