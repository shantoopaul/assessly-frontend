import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link href="/" className="font-semibold text-foreground">
          Assessly
        </Link>
        <p>
          Developer assessments, candidate progress, and structured reviews.
        </p>
        <p>©2026 Assessly</p>
      </div>
    </footer>
  );
};

export default Footer;
