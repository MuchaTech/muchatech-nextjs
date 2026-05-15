import Logo from "@/components/Logo";
import Link from "next/link";
import { useTheme } from "@/theme";

export default function FooterSecondary() {
  const { isDark } = useTheme();
  return (
    <footer className="border-t border-[var(--border)] mt-16 py-8 bg-[var(--bg-1)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link href="/">
          <Logo height={30} variant={isDark ? "dark" : "light"} />
        </Link>
        <span className="font-mono text-xs text-[var(--tx-2)]">
          © 2020–{new Date().getFullYear()} MuchaTech
        </span>
      </div>
    </footer>
  );
}
