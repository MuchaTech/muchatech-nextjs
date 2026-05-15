import { Zap, Globe, MapPin } from "lucide-react";

const pillars = [
  {
    icon: Zap,
    title: "We're Progressive.",
    text: "Security is a process. We stay current by conducting research and hands-on testing of emerging threats.",
    accent: "#2BE9F0",
  },
  {
    icon: Globe,
    title: "We're Agile.",
    text: "Embracing dynamic methodologies to thrive in our ever-evolving, interconnected, data-fuelled world.",
    accent: "#FC21D1",
  },
  {
    icon: MapPin,
    title: "We're Local.",
    text: "Local expertise, low latency, POPIA-compliant — with certified ethical hackers who know the SA landscape.",
    accent: "#2BE9F0",
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="py-16 md:py-28 bg-[var(--bg-0)] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-[radial-gradient(ellipse_at_80%_0%,rgba(43,233,240,0.08)_0%,transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="section-label">
          <span>// 001 · about</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--tx-0)] leading-tight mb-6">
              We&apos;re a <span className="text-brand">Cybersecurity Ops</span>{" "}
              Focused Company.
            </h2>
            <p className="text-[var(--tx-1)] leading-relaxed mb-10 text-lg">
              Services that confidently and securely scale up with your
              data-driven business. From assessments to full managed security
              operations.
            </p>

            <div className="space-y-6">
              {pillars.map(({ icon: Icon, title, text, accent }) => (
                <div key={title} className="flex gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border"
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
                    <h3 className="font-display font-semibold text-[var(--tx-0)] mb-1">
                      {title}
                    </h3>
                    <p className="text-[var(--tx-2)] text-sm leading-relaxed">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal card */}
          <div className="relative">
            <div className="absolute -inset-px rounded-2xl bg-brand-grad opacity-20 blur-sm" />
            <div className="relative bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl p-8 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#2BE9F0]/6 blur-3xl" />
              <div className="absolute -bottom-16 -left-8 w-40 h-40 rounded-full bg-[#FC21D1]/5 blur-3xl" />

              {/* Terminal chrome */}
              <div className="flex items-center gap-2 pb-4 border-b border-[var(--border)] mb-5">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28CA41]" />
                <span className="font-mono text-xs text-[var(--tx-3)] ml-2">
                  muchatech_status.sh
                </span>
              </div>

              <div className="font-mono text-sm space-y-2.5">
                <p>
                  <span className="text-[#2BE9F0]">$</span>{" "}
                  <span className="text-[var(--tx-2)]">services --list</span>
                </p>
                {[
                  "Security Assessments",
                  "Penetration Testing",
                  "Security Automation",
                  "SOCaaS [24/7]",
                ].map((s, i) => (
                  <p key={s} className="pl-4">
                    <span className="text-[#FC21D1]">→</span>{" "}
                    <span className="text-[var(--tx-0)]">{s}</span>
                    {i === 3 && (
                      <span className="ml-2 text-[#2BE9F0] text-xs">
                        ACTIVE
                      </span>
                    )}
                  </p>
                ))}
                <div className="pt-3">
                  <p>
                    <span className="text-[#2BE9F0]">$</span>{" "}
                    <span className="text-[var(--tx-2)]">
                      compliance --check
                    </span>
                  </p>
                  {[
                    ["POPIA", "#2BE9F0"],
                    ["Uptime", "#2BE9F0"],
                    ["P1 SLA", "#FC21D1"],
                  ].map(([k, c]) => (
                    <p key={k} className="pl-4">
                      <span style={{ color: c }}>{k}</span>
                      <span className="text-[var(--tx-3)]"> · </span>
                      <span className="text-[#2BE9F0]">✓</span>
                    </p>
                  ))}
                </div>
                <p className="text-[var(--tx-3)] pt-2">
                  <span className="text-[#2BE9F0]">$</span>{" "}
                  <span className="cursor" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
