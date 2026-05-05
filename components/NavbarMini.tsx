"use client";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/theme";
import Link from "next/link";

export default function NavbarMini() {
  const { isDark } = useTheme();
  return (
    <>
      {/* Nav */}
      <header className="bg-[var(--bg-0)]/90 border-b border-[var(--border)] sticky top-0 z-40 nav-blur">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <Logo height={36} variant={isDark ? "dark" : "light"} />
          </Link>
          <nav className="hidden md:flex items-center gap-5 font-mono text-sm">
            {["/", "/blog"].map((href) => {
              const labels: Record<string, string> = {
                "/": "Home",
                "/blog": "Blog",
              };
              const isActive = href === "/blog";
              return (
                <Link
                  key={href}
                  href={href}
                  className={`transition-colors ${isActive ? "text-[#2BE9F0]" : "text-[var(--tx-2)] hover:text-[var(--tx-0)]"}`}
                >
                  {labels[href]}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/#contact"
              className="px-4 py-2 bg-brand-grad text-[var(--bg-0)] font-mono text-sm rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Protected
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
