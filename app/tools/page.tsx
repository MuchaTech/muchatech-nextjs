"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  X,
  ExternalLink,
  Tag,
  Repeat,
  Zap,
  Lock,
  Star,
  Shield,
  ShoppingCart,
  Info,
  CreditCard,
} from "lucide-react";
import { tools, type Tool, type ToolCategory } from "@/app/data/tools";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/theme";
import { buildPayFastPayload, PAYFAST_URL } from "@/lib/payfast";

// ─── Category pill colours ────────────────────────────────────────
const catColour: Record<ToolCategory, string> = {
  Security: "#0094CC",
  Automation: "#00A86B",
  Monitoring: "#6366F1",
  Compliance: "#F59E0B",
};

// ─── Format currency ──────────────────────────────────────────────
function zar(amount: number) {
  return `R ${amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;
}

// ─── License badge ────────────────────────────────────────────────
function LicenseBadge({ license }: { license: Tool["license"] }) {
  const map: Record<
    Tool["license"],
    { label: string; icon: typeof Zap; colour: string }
  > = {
    "one-time": { label: "One-time", icon: Zap, colour: "#00A86B" },
    monthly: { label: "Monthly", icon: Repeat, colour: "#6366F1" },
    annual: { label: "Annual", icon: Star, colour: "#0094CC" },
  };
  const { label, icon: Icon, colour } = map[license];
  return (
    <span
      className="inline-flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded-full border"
      style={{
        color: colour,
        borderColor: `${colour}30`,
        backgroundColor: `${colour}0D`,
      }}
    >
      <Icon className="w-3 h-3" strokeWidth={2} /> {label}
    </span>
  );
}

// ─── Checkout modal ───────────────────────────────────────────────
function CheckoutModal({ tool, onClose }: { tool: Tool; onClose: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payload, setPayload] = useState<Record<string, string> | null>(null);
  const [step, setStep] = useState<"details" | "confirm">("details");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Valid email required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleProceed = () => {
    if (!validate()) return;
    const p = buildPayFastPayload({
      toolId: tool.id,
      toolName: tool.name,
      toolDesc: tool.tagline,
      amount: tool.price,
      license: tool.license,
      buyerFirstName: form.firstName,
      buyerLastName: form.lastName,
      buyerEmail: form.email,
    });
    setPayload(p);
    setStep("confirm");
  };

  const handlePay = () => {
    formRef.current?.submit();
  };

  const isSandbox = process.env.NEXT_PUBLIC_PAYFAST_SANDBOX !== "false";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[var(--bg-1)] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[var(--border)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{tool.icon}</span>
            <div>
              <h3 className="font-display font-bold text-[var(--tx-0)]">
                {tool.name}
              </h3>
              <LicenseBadge license={tool.license} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--tx-2)] hover:bg-[var(--bg-1)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sandbox banner */}
        {isSandbox && (
          <div className="mx-6 mt-4 px-4 py-2 bg-[#FC21D1]/05 border border-[#FC21D1]/30 rounded-xl flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[#FC21D1] flex-shrink-0" />
            <p className="font-mono text-xs text-[#FC21D1]">
              Sandbox mode — no real money processed
            </p>
          </div>
        )}

        {step === "details" ? (
          <div className="p-6 space-y-4">
            <p className="text-[var(--tx-1)] text-sm">
              Enter your details to proceed to secure payment via PayFast.
            </p>

            {/* Price summary */}
            <div className="bg-[var(--bg-0)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-mono text-xs text-[var(--tx-2)] uppercase tracking-widest mb-1">
                  Total due
                </p>
                <p
                  className="font-display text-2xl font-bold"
                  style={{ color: tool.accent }}
                >
                  {zar(tool.price)}
                </p>
              </div>
              <LicenseBadge license={tool.license} />
            </div>

            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "firstName", label: "First Name", placeholder: "Sipho" },
                { key: "lastName", label: "Last Name", placeholder: "Dlamini" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block font-mono text-xs text-[var(--tx-2)] uppercase tracking-widest mb-1.5">
                    {f.label}
                  </label>
                  <input
                    value={(form as Record<string, string>)[f.key]}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [f.key]: e.target.value }))
                    }
                    placeholder={f.placeholder}
                    className={`w-full bg-[var(--bg-0)] border rounded-xl px-3 py-2.5 font-mono text-sm text-[var(--tx-0)] outline-none transition-all
                      ${errors[f.key] ? "border-red-300 focus:border-red-400" : "border-[var(--border)] focus:border-[#2BE9F0]/40"}`}
                  />
                  {errors[f.key] && (
                    <p className="font-mono text-xs text-[#FC21D1] mt-1">
                      {errors[f.key]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Email */}
            <div>
              <label className="block font-mono text-xs text-[var(--tx-2)] uppercase tracking-widest mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="you@company.co.za"
                className={`w-full bg-[var(--bg-0)] border rounded-xl px-3 py-2.5 font-mono text-sm text-[var(--tx-0)] outline-none transition-all
                  ${errors.email ? "border-red-300 focus:border-red-400" : "border-[var(--border)] focus:border-[#2BE9F0]/40"}`}
              />
              {errors.email && (
                <p className="font-mono text-xs text-[#FC21D1] mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <button
              onClick={handleProceed}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-grad text-white font-display font-semibold text-sm rounded-xl hover:opacity-90 transition-colors glow-cyan"
            >
              <CreditCard className="w-4 h-4" /> Continue to PayFast
            </button>

            <p className="text-center font-mono text-xs text-[var(--tx-2)]">
              Secured by <span className="text-[#2BE9F0]">PayFast</span> · ZAR
              payments · SSL encrypted
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-[#FC21D1]" />
              <p className="font-display font-semibold text-[var(--tx-0)] text-sm">
                Review your order
              </p>
            </div>

            {/* Order summary */}
            <div className="bg-[var(--bg-0)] border border-[var(--border)] rounded-xl divide-y divide-[#E1E8F4]">
              {[
                ["Product", tool.name],
                [
                  "Licence",
                  tool.license === "one-time"
                    ? "Lifetime"
                    : tool.license === "monthly"
                      ? "Monthly subscription"
                      : "Annual subscription",
                ],
                ["Buyer", `${form.firstName} ${form.lastName}`],
                ["Email", form.email],
                ["Amount", `${zar(tool.price)} ZAR`],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between px-4 py-2.5"
                >
                  <span className="font-mono text-xs text-[var(--tx-2)]">
                    {k}
                  </span>
                  <span className="font-mono text-xs font-semibold text-[var(--tx-0)]">
                    {v}
                  </span>
                </div>
              ))}
            </div>

            {/* Hidden PayFast form */}
            {payload && (
              <form
                ref={formRef}
                method="POST"
                action={PAYFAST_URL}
                className="hidden"
              >
                {Object.entries(payload).map(([k, v]) => (
                  <input key={k} type="hidden" name={k} value={v} />
                ))}
              </form>
            )}

            <button
              onClick={handlePay}
              className="w-full flex items-center justify-center gap-2 py-3.5 font-display font-semibold text-sm rounded-xl text-white transition-colors"
              style={{ backgroundColor: tool.accent }}
            >
              <Lock className="w-4 h-4" /> Pay {zar(tool.price)} via PayFast
            </button>

            <button
              onClick={() => setStep("details")}
              className="w-full py-2.5 font-mono text-xs text-[var(--tx-2)] hover:text-[var(--tx-0)] transition-colors"
            >
              ← Edit details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tool card ────────────────────────────────────────────────────
function ToolCard({ tool, onBuy }: { tool: Tool; onBuy: (t: Tool) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`group relative bg-[var(--bg-1)] border rounded-2xl overflow-hidden  flex flex-col transition-all duration-300
      ${expanded ? "border-[#2BE9F0]/40 shadow-lg" : "border-[var(--border)] hover:border-[#2BE9F0]/30 "}`}
    >
      {/* Accent top bar */}
      <div
        className="h-1.5"
        style={{
          background: `linear-gradient(90deg, ${tool.accent}, transparent)`,
        }}
      />

      {/* Badge */}
      {tool.badge && (
        <div className="absolute top-5 right-5">
          <span
            className="font-mono text-xs font-bold px-2.5 py-1 rounded-full text-white"
            style={{ backgroundColor: tool.accent }}
          >
            {tool.badge}
          </span>
        </div>
      )}

      <div className="p-7 flex flex-col flex-1">
        {/* Icon + category */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl border"
            style={{
              borderColor: `${tool.accent}25`,
              backgroundColor: `${tool.accent}0D`,
            }}
          >
            {tool.icon}
          </div>
          <span
            className="font-mono text-xs px-2.5 py-1 rounded-full border"
            style={{
              color: catColour[tool.category],
              borderColor: `${catColour[tool.category]}30`,
              backgroundColor: `${catColour[tool.category]}0D`,
            }}
          >
            {tool.category}
          </span>
        </div>

        {/* Name + tagline */}
        <h3 className="font-display text-xl font-bold text-[var(--tx-0)] mb-1">
          {tool.name}
        </h3>
        <p className="font-mono text-xs text-[var(--tx-2)] mb-3">
          {tool.tagline}
        </p>

        {/* Description */}
        <p className="text-[var(--tx-1)] text-sm leading-relaxed mb-5">
          {tool.description}
        </p>

        {/* Feature list — expandable */}
        <div className="mb-5">
          <ul className="space-y-2">
            {(expanded ? tool.features : tool.features.slice(0, 3)).map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 text-sm text-[var(--tx-1)]"
              >
                <CheckCircle
                  className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                  style={{ color: tool.accent }}
                  strokeWidth={2.5}
                />
                {f}
              </li>
            ))}
          </ul>
          {tool.features.length > 3 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 font-mono text-xs flex items-center gap-1 transition-colors"
              style={{ color: tool.accent }}
            >
              {expanded
                ? "Show less"
                : `+${tool.features.length - 3} more features`}
              <ChevronRight
                className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`}
              />
            </button>
          )}
        </div>

        <div className="mt-auto space-y-3">
          {/* Pricing */}
          <div className="flex items-end gap-2">
            <div>
              {tool.originalPrice && (
                <p className="font-mono text-xs text-[var(--tx-2)] line-through">
                  {zar(tool.originalPrice)}
                </p>
              )}
              <p
                className="font-display text-2xl font-bold"
                style={{ color: tool.accent }}
              >
                {zar(tool.price)}
              </p>
            </div>
            <div className="mb-1 flex flex-col gap-1">
              <LicenseBadge license={tool.license} />
              {tool.originalPrice && (
                <span className="font-mono text-xs text-[#FC21D1] font-semibold">
                  Save {Math.round((1 - tool.price / tool.originalPrice) * 100)}
                  %
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => onBuy(tool)}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-white font-display font-semibold text-sm rounded-xl transition-colors"
              style={{ backgroundColor: tool.accent }}
            >
              <ShoppingCart className="w-4 h-4" />
              Buy Now
            </button>
            {tool.docsUrl && (
              <a
                href={tool.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 px-3 py-3 border border-[var(--border)] text-[var(--tx-2)] hover:text-[#2BE9F0] hover:border-[#2BE9F0]/30 rounded-xl transition-all font-mono text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────
const categories: ToolCategory[] = [
  "Security",
  "Automation",
  "Monitoring",
  "Compliance",
];

export default function ToolsPage() {
  const { isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "All">(
    "All",
  );
  const [activeLicense, setActiveLicense] = useState<Tool["license"] | "All">(
    "All",
  );
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const urlParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const cancelled = urlParams?.get("cancelled") === "1";

  const filtered = tools.filter((t) => {
    const matchCat = activeCategory === "All" || t.category === activeCategory;
    const matchLic = activeLicense === "All" || t.license === activeLicense;
    return matchCat && matchLic;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-0)]">
      {/* Nav */}
      <header className="bg-[var(--bg-0)]/90 border-b border-[var(--border)] sticky top-0 z-40 nav-blur">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <Logo height={36} variant={isDark ? "dark" : "light"} />
          </Link>
          <nav className="hidden md:flex items-center gap-5 font-mono text-sm">
            {["/", "/blog", "/tools"].map((href) => {
              const labels: Record<string, string> = {
                "/": "home",
                "/blog": "blog",
                "/tools": "tools",
              };
              const isActive = href === "/tools";
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

      {/* Cancelled banner */}
      {cancelled && (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="flex items-center gap-3 px-5 py-3 bg-[#FC21D1]/05 border border-[#FC21D1]/30 rounded-xl">
            <Info className="w-4 h-4 text-[#FC21D1] flex-shrink-0" />
            <p className="font-mono text-sm text-[#FC21D1]">
              Payment was cancelled. No charge was made.
            </p>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="relative overflow-hidden bg-[var(--bg-0)] border-b border-[var(--border)]">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-brand-grad/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-[#FC21D1]/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--bg-1)] border border-[var(--border)] rounded-full mb-6 shadow-sm">
            <Tag className="w-3.5 h-3.5 text-[#2BE9F0]" />
            <span className="font-mono text-xs text-[var(--tx-2)] tracking-widest uppercase">
              MuchaTech Tools Store
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-[var(--tx-0)] mb-5">
            Built-in-SA
            <br />
            <span className="text-gradient">Cybersecurity Tools</span>
          </h1>
          <p className="text-[var(--tx-1)] text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Professional security tools developed by MuchaTech for South African
            businesses. POPIA-aware, ZAR-priced, instantly downloadable after
            payment via PayFast.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Lock, label: "PayFast Secured" },
              { icon: Shield, label: "POPIA Compliant" },
              { icon: CheckCircle, label: "Instant Access" },
              { icon: Repeat, label: "Cancel Anytime" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-1)] border border-[var(--border)] rounded-full shadow-sm"
              >
                <Icon
                  className="w-3.5 h-3.5 text-[#2BE9F0]"
                  strokeWidth={1.5}
                />
                <span className="font-mono text-xs text-[var(--tx-1)]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[var(--bg-1)] border-b border-[var(--border)] sticky top-14 z-30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap gap-2 items-center">
          <span className="font-mono text-xs text-[var(--tx-2)] mr-1">
            Category:
          </span>
          {(["All", ...categories] as const).map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3 py-1.5 font-mono text-xs rounded-lg border transition-all ${
                activeCategory === c
                  ? "bg-brand-grad text-white border-[#2BE9F0]"
                  : "bg-[var(--bg-1)] text-[var(--tx-2)] border-[var(--border)] hover:border-[#2BE9F0]/30 hover:text-[#2BE9F0]"
              }`}
            >
              {c}
            </button>
          ))}
          <div className="w-px h-4 bg-[#E1E8F4] mx-1" />
          <span className="font-mono text-xs text-[var(--tx-2)] mr-1">
            Licence:
          </span>
          {(["All", "one-time", "monthly", "annual"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setActiveLicense(l)}
              className={`px-3 py-1.5 font-mono text-xs rounded-lg border transition-all capitalize ${
                activeLicense === l
                  ? "bg-brand-grad text-white border-[#2BE9F0]"
                  : "bg-[var(--bg-1)] text-[var(--tx-2)] border-[var(--border)] hover:border-[#2BE9F0]/30 hover:text-[#2BE9F0]"
              }`}
            >
              {l === "one-time" ? "One-time" : l}
            </button>
          ))}
          <span className="ml-auto font-mono text-xs text-[var(--tx-2)]">
            {filtered.length} tool{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Tools grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-[var(--tx-2)]">
            <Shield className="w-14 h-14 mx-auto mb-4 text-[#E1E8F4]" />
            <p className="font-display text-lg font-semibold text-[var(--tx-0)] mb-2">
              No tools match your filters
            </p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setActiveLicense("All");
              }}
              className="font-mono text-sm text-[#2BE9F0] hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tool) => (
              <ToolCard key={tool.id} tool={tool} onBuy={setSelectedTool} />
            ))}
          </div>
        )}

        {/* PayFast info strip */}
        <div className="mt-14 p-6 bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl flex flex-col md:flex-row items-center gap-5 ">
          <div className="w-12 h-12 rounded-xl bg-brand-grad/10 border border-[#2BE9F0]/20 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-5 h-5 text-[#2BE9F0]" strokeWidth={1.5} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-display font-bold text-[var(--tx-0)] mb-1">
              Secure ZAR payments via PayFast
            </h3>
            <p className="text-[var(--tx-1)] text-sm leading-relaxed">
              All transactions are processed by PayFast — South Africa&apos;s
              leading payment gateway. Accepted: Visa, Mastercard, Instant EFT,
              Mobicred, MoreTyme, and more. Subscriptions can be cancelled at
              any time from your PayFast dashboard.
            </p>
          </div>
          <a
            href="https://www.payfast.co.za"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 border border-[var(--border)] text-[var(--tx-1)] font-mono text-xs rounded-xl hover:border-[#2BE9F0]/30 hover:text-[#2BE9F0] transition-all flex-shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" /> PayFast site
          </a>
        </div>

        {/* Enterprise CTA */}
        <div className="mt-6 p-8 rounded-2xl bg-[radial-gradient(ellipse_at_50%_50%,rgba(43,233,240,0.06),rgba(252,33,209,0.04),transparent_70%)] border border-[#2BE9F0]/20 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-display text-xl font-bold text-[var(--tx-0)] mb-2">
              Need a custom tool?
            </h3>
            <p className="text-[var(--tx-1)] text-sm leading-relaxed">
              We build bespoke security tools tailored to your environment — SOC
              automation, compliance dashboards, custom SIEM connectors and
              more.
            </p>
          </div>
          <Link
            href="/#contact"
            className="flex items-center gap-2 px-6 py-3 bg-brand-grad text-white font-display font-semibold text-sm rounded-xl hover:opacity-90 transition-colors whitespace-nowrap glow-cyan"
          >
            Talk to us <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-10 py-8 bg-[var(--bg-1)]">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/">
            <Logo height={30} variant={isDark ? "dark" : "light"} />
          </Link>
          <span className="font-mono text-xs text-[var(--tx-2)]">
            © 2020–2026 MuchaTech
          </span>
        </div>
      </footer>

      {/* Checkout modal */}
      {selectedTool && (
        <CheckoutModal
          tool={selectedTool}
          onClose={() => setSelectedTool(null)}
        />
      )}
    </div>
  );
}
