"use client";
import { useState } from "react";
import { ExternalLink } from "lucide-react";

const filters = ["All", "Development", "Cybersecurity", "Automation"];

const projects = [
  {
    title: "Temo Process Technologies",
    desc: "Minerals processing solutions provider — secure IT infrastructure design and implementation.",
    url: "https://www.temoprocess.co.za",
    tags: ["Cybersecurity", "Development"],
    accent: "#2BE9F0",
  },
  {
    title: "Hydrosizer PLC",
    desc: "Minerals processing technology provider with custom PLC automation and security hardening.",
    url: "https://www.metq.co.za",
    tags: ["Automation", "Development"],
    accent: "#FC21D1",
  },
  {
    title: "Oaklapine",
    desc: "Custom build and modern furniture — e-commerce platform with secure payment processing.",
    url: "https://www.oaklapine.com",
    tags: ["Development"],
    accent: "#2BE9F0",
  },
  {
    title: "Khulong Mining Supplies",
    desc: "Real-time machinery workshop application — designed, built and secured from the ground up.",
    url: "https://www.khulongminingsupply.com",
    tags: ["Development", "Cybersecurity", "Automation"],
    accent: "#FC21D1",
  },
];

export default function Portfolio() {
  const [active, setActive] = useState("All");
  const filtered = projects.filter(
    (p) => active === "All" || p.tags.includes(active),
  );

  return (
    <section id="portfolio" className="py-28 bg-[var(--bg-1)] relative">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="section-label">
          <span>// 004 · portfolio</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-[var(--tx-0)]">
            Hands-on <span className="text-brand">Works</span>
          </h2>
          {/* Filter tabs */}
          <div className="flex gap-1 bg-[var(--bg-0)] border border-[var(--border)] p-1 rounded-xl">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`px-4 py-1.5 font-mono text-xs rounded-lg transition-all ${
                  active === f
                    ? "text-[var(--bg-0)] bg-brand-grad font-semibold"
                    : "text-[var(--tx-2)] hover:text-[var(--tx-0)]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {filtered.map((project) => (
            <a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover group bg-[var(--bg-0)] border border-[var(--border)] rounded-2xl p-7 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className="w-11 h-11 rounded-xl border flex items-center justify-center font-display text-lg font-bold"
                  style={{
                    borderColor: `${project.accent}25`,
                    color: project.accent,
                    backgroundColor: `${project.accent}0D`,
                  }}
                >
                  {project.title[0]}
                </div>
                <ExternalLink
                  className="w-4 h-4 text-[var(--tx-3)] group-hover:text-[#2BE9F0] transition-colors flex-shrink-0 mt-1"
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <h3 className="font-display font-semibold text-[var(--tx-0)] mb-2 group-hover:text-[#2BE9F0] transition-colors">
                  {project.title}
                </h3>
                <p className="text-[var(--tx-2)] text-sm leading-relaxed">
                  {project.desc}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs px-2.5 py-1 rounded border"
                    style={{
                      borderColor: `${project.accent}25`,
                      color: project.accent,
                      backgroundColor: `${project.accent}08`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
