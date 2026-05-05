"use client";
import { useEffect, useRef, useState } from "react";

const skills = [
  { label: "Risk Prioritization & Patch Roadmaps", pct: 95 },
  { label: "Exploit Development", pct: 88 },
  { label: "Threat Intelligence", pct: 92 },
  { label: "Incident Response", pct: 96 },
  { label: "Tiered Analysis", pct: 90 },
  { label: "API Integration (EDR/SIEM)", pct: 85 },
  { label: "Compliance Mapping", pct: 93 },
];

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const [go, setGo] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setGo(true);
      },
      { threshold: 0.3 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="py-28 bg-[var(--bg-0)] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-[radial-gradient(ellipse,rgba(43,233,240,0.05)_0%,rgba(252,33,209,0.04)_50%,transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="section-label">
          <span>// 003 · skills</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-[var(--tx-0)] leading-tight mb-6">
              Expertise in <span className="text-brand">Cybersecurity</span>{" "}
              <span className="font-mono text-[#2BE9F0] text-3xl">
                {"{ Domains }"}
              </span>
            </h2>
            <p className="text-[var(--tx-2)] text-lg leading-relaxed mb-8">
              Effective and reliable teamwork through our in-house talent and
              seasoned professionals.
            </p>

            {/* Cert badges */}
            <div className="flex flex-wrap gap-2">
              {["OSCP", "CEH", "CISSP", "ISO 27001", "POPIA"].map((c) => (
                <span
                  key={c}
                  className="font-mono text-xs px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--tx-2)] hover:border-[#2BE9F0]/40 hover:text-[#2BE9F0] transition-all cursor-default"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {skills.map(({ label, pct }, i) => (
              <div key={label}>
                <div className="flex justify-between mb-2">
                  <span className="font-mono text-xs text-[var(--tx-2)]">
                    <span className="text-[var(--tx-3)]">
                      {String(i + 1).padStart(2, "0")}—{" "}
                    </span>
                    {label}
                  </span>
                  <span
                    className="font-mono text-xs"
                    style={{
                      background: "linear-gradient(135deg,#2BE9F0,#FC21D1)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {pct}%
                  </span>
                </div>
                <div className="skill-bar">
                  <div
                    className="skill-bar-fill"
                    style={{ width: go ? `${pct}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
