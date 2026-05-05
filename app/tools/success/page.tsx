"use client";
import { use } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Download,
  ArrowRight,
  Mail,
  LifeBuoy,
} from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/theme";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = use(searchParams);
  const { isDark } = useTheme();
  const orderId = params.order ?? "MT-UNKNOWN";

  return (
    <div className="min-h-screen bg-[var(--bg-0)] flex flex-col">
      {/* Nav */}
      <header className="bg-[var(--bg-0)]/90 border-b border-[var(--border)] nav-blur">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <Logo height={36} variant={isDark ? "dark" : "light"} />
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-lg text-center">
          {/* Success icon */}
          <div className="w-20 h-20 rounded-full bg-[#FC21D1]/10 border-2 border-[#FC21D1]/30 flex items-center justify-center mx-auto mb-8">
            <CheckCircle
              className="w-10 h-10 text-[#FC21D1]"
              strokeWidth={1.5}
            />
          </div>

          <h1 className="font-display text-4xl font-bold text-[var(--tx-0)] mb-3">
            Payment Successful!
          </h1>
          <p className="text-[var(--tx-1)] text-lg mb-2">
            Your purchase has been confirmed.
          </p>
          <p className="font-mono text-sm text-[var(--tx-2)] mb-10">
            Order ID: <span className="text-[#2BE9F0]">{orderId}</span>
          </p>

          {/* What happens next */}
          <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl p-7 text-left  mb-8">
            <h2 className="font-display font-bold text-[var(--tx-0)] mb-5">
              What happens next
            </h2>
            <div className="space-y-4">
              {[
                {
                  icon: Mail,
                  step: "1",
                  title: "Check your email",
                  desc: "We'll send your download link and licence key to the email address you provided at checkout.",
                  accent: "#0094CC",
                },
                {
                  icon: Download,
                  step: "2",
                  title: "Download & install",
                  desc: "Follow the setup guide included in your email. Reach out to support if you need help.",
                  accent: "#00A86B",
                },
                {
                  icon: LifeBuoy,
                  step: "3",
                  title: "Onboarding call (optional)",
                  desc: "Book a free 30-minute onboarding call with our team to get the most out of your new tool.",
                  accent: "#0094CC",
                },
              ].map(({ icon: Icon, step, title, desc, accent }) => (
                <div key={step} className="flex gap-4">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border"
                    style={{
                      borderColor: `${accent}25`,
                      backgroundColor: `${accent}0D`,
                    }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: accent }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-[var(--tx-0)] text-sm mb-0.5">
                      {title}
                    </h3>
                    <p className="text-[var(--tx-1)] text-sm leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tools"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-grad text-white font-display font-semibold text-sm rounded-xl hover:opacity-90 transition-colors glow-cyan"
            >
              Browse more tools <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--border)] text-[var(--tx-1)] font-mono text-sm rounded-xl hover:border-[#2BE9F0]/30 hover:text-[#2BE9F0] transition-colors"
            >
              <Mail className="w-4 h-4" /> Contact support
            </Link>
          </div>

          <p className="mt-8 font-mono text-xs text-[var(--tx-2)]">
            Didn&apos;t receive an email?{" "}
            <a
              href="mailto:support@muchatech.com"
              className="text-[#2BE9F0] hover:underline"
            >
              support@muchatech.com
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
