import type { ReactNode } from "react";

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen" suppressHydrationWarning>
      <header>Header</header>
      <main className="flex-1 min-h-screen">{children}</main>
      <footer>Footer</footer>
    </div>
  );
};

export default PublicLayout;
