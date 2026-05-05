"use client";
import { useEffect, useRef, useState } from "react";
import { Users, FolderOpen, ThumbsUp, Coffee } from "lucide-react";

const stats = [
  { icon: Users, value: 20, suffix: "+", label: "Happy Clients" },
  { icon: FolderOpen, value: 35, suffix: "+", label: "Projects Completed" },
  { icon: ThumbsUp, value: 98, suffix: "%", label: "Positive Feedback" },
  { icon: Coffee, value: 500, suffix: "+", label: "Cups of Coffee" },
];

function Counter({
  value,
  suffix,
  active,
}: {
  value: number;
  suffix: string;
  active: boolean;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const step = Math.ceil(value / 50);
    const t = setInterval(() => {
      setN((c) => {
        if (c + step >= value) {
          clearInterval(t);
          return value;
        }
        return c + step;
      });
    }, 28);
    return () => clearInterval(t);
  }, [value, active]);
  return (
    <>
      {n}
      {suffix}
    </>
  );
}

function StatItem({ icon: Icon, value, suffix, label }: (typeof stats)[0]) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setActive(true);
      },
      { threshold: 0.5 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center text-center p-8">
      <div
        className="w-12 h-12 rounded-xl border border-[var(--border)] flex items-center justify-center mb-4"
        style={{
          background:
            "linear-gradient(135deg,rgba(43,233,240,0.08),rgba(252,33,209,0.06))",
        }}
      >
        <Icon className="w-5 h-5 text-[#2BE9F0]" strokeWidth={1.5} />
      </div>
      <div className="font-display text-4xl font-extrabold mb-1 text-brand">
        <Counter value={value} suffix={suffix} active={active} />
      </div>
      <div className="font-mono text-xs text-[var(--tx-2)] uppercase tracking-widest">
        {label}
      </div>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="py-12 bg-[var(--bg-0)] border-y border-[var(--border)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(43,233,240,0.04),rgba(252,33,209,0.03),transparent_70%)]" />
      <div className="relative max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[var(--border)]">
          {stats.map((s) => (
            <StatItem key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
