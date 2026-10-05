import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us" },
  { label: "Contact", href: "/contact-us" },
];

const Header = () => {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-primary"
        >
          Assessly
        </Link>

        <div className="flex items-center gap-2 sm:gap-5">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}

          <Link href="/login">
            <Button>
              Sign in
              <ArrowRight aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
