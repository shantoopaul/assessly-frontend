import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold text-primary">404 error</p>

      <h1 className="mt-4 text-4xl font-bold tracking-tight">Page not found</h1>

      <p className="mt-3 max-w-md text-muted-foreground">
        The page you requested does not exist or may have been moved.
      </p>

      <Link
        href="/"
        className="mt-6 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
      >
        Return home
      </Link>
    </main>
  );
}
