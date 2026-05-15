"use client";
import { Github } from "lucide-react";
import Logo from "@/components/Logo";
import { useTheme } from "@/theme";

const footerLinks = {
  Services: [
    { label: "Managed Cybersecurity", href: "#cybersecurity" },
    { label: "Automation & Tools", href: "#automation" },
    { label: "Cybersecurity R&D", href: "#rd" },
    { label: "Pricing Plans", href: "#pricing" },
  ],
  Company: [
    { label: "About Us", href: "#about" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Clients", href: "#testimonials" },
    // { label: "Tools Store", href: "/tools" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "#contact" },
  ],
  Legal: [{ label: "Policies", href: "/legal" }],
};

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className="bg-[var(--bg-1)] border-t border-[var(--border)] relative overflow-hidden">
      {/* Dual corner glows */}
      <div className="absolute top-0 left-0 w-[400px] h-[200px] bg-[radial-gradient(ellipse_at_0%_0%,rgba(43,233,240,0.05)_0%,transparent_60%)]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[200px] bg-[radial-gradient(ellipse_at_100%_100%,rgba(252,33,209,0.04)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="py-10 md:py-16 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-12">
          <div className="lg:col-span-2">
            <a href="#" className="inline-block mb-5">
              <Logo height={44} variant={isDark ? "dark" : "light"} />
            </a>
            <p className="text-[#4D4B4B] text-sm leading-relaxed max-w-xs mb-6">
              Cybersecurity operations, automation, and R&amp;D — confidently
              protecting South African businesses in a data-driven world.
            </p>

            {/* Live indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-0)] border border-[var(--border)] rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2BE9F0] animate-pulse-slow" />
              <span className="font-mono text-xs text-[#4D4B4B]">
                Systems operational
              </span>
            </div>

            <div className="flex gap-3">
              <a
                href="https://github.com/muchatech"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-[var(--border)] flex items-center justify-center text-[#4D4B4B] hover:text-[#2BE9F0] hover:border-[#2BE9F0]/40 transition-all"
              >
                <Github className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <div className="font-mono text-xs tracking-widest uppercase mb-5 text-brand">
                {group}
              </div>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-[#4D4B4B] hover:text-[var(--tx-1)] transition-colors"
                      {...(href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Gradient divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent mb-0" />

        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-[#4D4B4B]">
            Copyright © 2020–{new Date().getFullYear()}{" "}
            <a
              href="https://github.com/muchatech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2BE9F0] hover:text-[#FC21D1] transition-colors"
            >
              MuchaTech
            </a>
            . All rights reserved.
          </p>
          <div className="font-mono text-xs text-[#4D4B4B] flex items-center gap-1">
            <span className="text-[#2BE9F0]">{"</"}</span>
            Built &amp; designed by MuchaTech
            <span className="text-[#FC21D1]">{">"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
