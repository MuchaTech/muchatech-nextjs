import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Lemos Kail",
    date: "Sep 26, 2021",
    initial: "L",
    accent: "#2BE9F0",
    quote:
      "MuchaTech understands the importance of client satisfaction and retention by paying attention to details!",
  },
  {
    name: "Lefa Morabe",
    date: "Aug 26, 2025",
    initial: "L",
    accent: "#FC21D1",
    quote:
      "I have never worked with such talented individuals who are passionate about their work!",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-28 bg-[var(--bg-0)] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[radial-gradient(ellipse,rgba(43,233,240,0.05),rgba(252,33,209,0.04),transparent_70%)]" />

      <div className="relative max-w-5xl mx-auto px-6">
        <div className="section-label">
          <span>// 006 · testimonials</span>
        </div>

        <h2 className="font-display text-4xl md:text-5xl font-extrabold text-[var(--tx-0)] mb-14">
          What Clients <span className="text-brand">Say</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="card-hover relative bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl p-8 overflow-hidden"
            >
              {/* Gradient top bar */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{
                  background: `linear-gradient(90deg, ${t.accent}, transparent)`,
                }}
              />
              <Quote
                className="absolute top-6 right-6 w-8 h-8 opacity-8"
                style={{ color: t.accent }}
              />

              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-display font-bold text-lg"
                  style={{ borderColor: t.accent, color: t.accent }}
                >
                  {t.initial}
                </div>
                <div>
                  <div className="font-display font-semibold text-[var(--tx-0)]">
                    {t.name}
                  </div>
                  <div className="font-mono text-xs text-[var(--tx-3)]">
                    {t.date}
                  </div>
                </div>
              </div>

              <p className="text-[var(--tx-1)] leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex gap-1.5 mt-6">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: t.accent }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
