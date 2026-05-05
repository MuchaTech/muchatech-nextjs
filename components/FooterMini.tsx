import Link from "next/link";
import Logo from "./Logo";
import { useTheme } from "@/lib/theme";

const footerLinks = {
  Legal: [
    { label: "Privacy Policy", href: "/legal/pp" },
    { label: "Data Protection", href: "/legal/dp" },
    { label: "POPIA Compliance", href: "/legal/popia" },
    { label: "Cookie Policy", href: "/legal/cookie" },
  ],
};

export default function FooterMini() {
  const { isDark } = useTheme();
  return (
    <footer className="border-t border-[var(--border)] mt-20 py-8 bg-[var(--bg-1)]">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Link href="/">
          <Logo height={30} variant={isDark ? "dark" : "light"} />
        </Link>
        <span className="font-mono text-xs text-[var(--tx-2)]">
          © 2020–{new Date().getFullYear()} MuchaTech
        </span>
        <div className="flex gap-4">
          {footerLinks.Legal.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-xs text-[var(--tx-2)]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
