"use client";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, PenLine, ShoppingBag, Zap } from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/theme";

const navLinks = [
  { label: "About", href: "#about" },
  {
    label: "Services",
    href: "#services",
    children: [
      { label: "Cybersecurity", href: "#cybersecurity" },
      { label: "Automation & Tools", href: "#automation" },
      { label: "Research & Development", href: "#rd" },
    ],
  },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Pricing", href: "#pricing" },
  { label: "Clients", href: "#testimonials" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ── Hover helpers with a 120ms close delay ──────────────────
     This bridges the invisible gap between the trigger button
     and the dropdown panel so the menu doesn't flicker closed
     when the cursor briefly crosses the gap.
  ─────────────────────────────────────────────────────────── */
  const openServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 120);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 nav-blur"
      style={{
        backgroundColor: scrolled
          ? "color-mix(in srgb, var(--bg-0) 90%, transparent)"
          : "transparent",
        borderBottom: scrolled ? "1px solid var(--border)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center">
          <Logo height={38} variant={isDark ? "dark" : "light"} />
        </a>

        {/* ── Desktop nav ───────────────────────────────────── */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) =>
            link.children ? (
              /* Services dropdown */
              <div
                key={link.label}
                className="relative"
                onMouseEnter={openServices}
                onMouseLeave={scheduleClose}
              >
                {/* Trigger button — click also opens the menu */}
                <button
                  onClick={() => setServicesOpen((v) => !v)}
                  className="flex items-center gap-1 px-3 py-2 font-mono text-xs transition-colors"
                  style={{
                    color: servicesOpen ? "var(--cyan)" : "var(--tx-2)",
                  }}
                >
                  {link.label}
                  <ChevronDown
                    className="w-3 h-3 transition-transform duration-200"
                    style={{
                      transform: servicesOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                </button>

                {/*
                  Dropdown panel.
                  — NO mt-* gap: the panel starts immediately below the button.
                  — Visual separation comes from pt-2 padding inside the panel
                    so the first item doesn't crowd the border.
                  — onMouseEnter/Leave keep the same timer so hovering the
                    panel itself cancels the scheduled close.
                */}
                <div
                  onMouseEnter={openServices}
                  onMouseLeave={scheduleClose}
                  className="absolute top-full left-0 w-52 border rounded-xl overflow-hidden shadow-2xl transition-all duration-200"
                  style={{
                    backgroundColor: "var(--bg-1)",
                    borderColor: "var(--border)",
                    opacity: servicesOpen ? 1 : 0,
                    transform: servicesOpen
                      ? "translateY(0)"
                      : "translateY(-6px)",
                    pointerEvents: servicesOpen ? "auto" : "none",
                  }}
                >
                  <div className="pt-1 pb-1">
                    {link.children.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        onClick={() => setServicesOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 font-mono text-xs whitespace-nowrap transition-all"
                        style={{ color: "var(--tx-1)" }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.color = "var(--cyan)";
                          el.style.backgroundColor = "var(--bg-2)";
                          el.style.paddingLeft = "20px";
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.color = "var(--tx-1)";
                          el.style.backgroundColor = "";
                          el.style.paddingLeft = "";
                        }}
                      >
                        <span
                          className="text-base leading-none"
                          style={{ color: "var(--magenta)" }}
                        >
                          ›
                        </span>
                        {child.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Regular nav link */
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 font-mono text-xs transition-colors"
                style={{ color: "var(--tx-2)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "var(--cyan)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "var(--tx-2)")
                }
              >
                {link.label}
              </a>
            ),
          )}
        </nav>

        {/* ── Actions ──────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          {mobileOpen && <ThemeToggle />}
          {/*<a
            href="/tools"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 font-mono text-xs rounded-lg border transition-all"
            style={{
              color: "var(--tx-2)",
              borderColor: "var(--border)",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "var(--cyan)";
              el.style.borderColor = "rgba(43,233,240,0.4)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "var(--tx-2)";
              el.style.borderColor = "var(--border)";
            }}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Tools
          </a>

          <a
            href="/admin/blog"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 font-mono text-xs rounded-lg border transition-all"
            style={{
              color: "var(--tx-2)",
              borderColor: "var(--border)",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "var(--magenta)";
              el.style.borderColor = "rgba(252,33,209,0.4)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "var(--tx-2)";
              el.style.borderColor = "var(--border)";
            }}
          >
            <PenLine className="w-3.5 h-3.5" /> Write
          </a>*/}

          <ThemeToggle className="hidden md:flex" />

          <a
            href="#contact"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-mono text-xs font-semibold hover:opacity-90 transition-opacity glow-cyan"
            style={{ background: "var(--grad)", color: "var(--bg-0)" }}
          >
            <Zap className="w-3.5 h-3.5" /> Get Protected
          </a>

          <button
            className="md:hidden transition-colors"
            style={{ color: "var(--tx-1)" }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ──────────────────────────────────────── */}

      {mobileOpen && (
        <div
          className="md:hidden border-b px-4 sm:px-6 py-4"
          style={{
            backgroundColor: "var(--bg-0)",
            borderColor: "var(--border)",
          }}
        >
          {/* Mobile header row */}

          <div
            className="flex items-center justify-between mb-5 pb-4"
            style={{ borderBottom: "1px solid var(--border)" }}
          ></div>

          {navLinks.map((link) => (
            <div key={link.label}>
              <a
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3 font-mono text-sm transition-colors"
                style={{
                  color: "var(--tx-1)",
                  borderBottom:
                    "1px solid color-mix(in srgb, var(--border) 60%, transparent)",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "var(--cyan)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "var(--tx-1)")
                }
              >
                {link.label}
              </a>
              {link.children?.map((child) => (
                <a
                  key={child.href}
                  href={child.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 py-2.5 pl-4 font-mono text-xs transition-all"
                  style={{ color: "var(--tx-3)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "var(--cyan)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "var(--tx-3)")
                  }
                >
                  <span style={{ color: "var(--magenta)" }}>›</span>
                  {child.label}
                </a>
              ))}
            </div>
          ))}

          {/*<div
            className="flex gap-4 mt-4 pt-4"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <a
              href="/tools"
              className="flex items-center gap-1.5 font-mono text-xs"
              style={{ color: "var(--cyan)" }}
            >
              <ShoppingBag className="w-4 h-4" /> Tools
            </a>
            <a
              href="/admin/blog"
              className="flex items-center gap-1.5 font-mono text-xs"
              style={{ color: "var(--magenta)" }}
            >
              <PenLine className="w-4 h-4" /> Write post
            </a>
          </div>*/}
        </div>
      )}
    </header>
  );
}
