import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "R0",
    period: "/month",
    tag: null,
    accent: "#4D4B4B",
    features: [
      "M365-enabled machine optimisation",
      "Management email breach check",
      "Privacy & anonymity status check",
    ],
  },
  {
    name: "Silver",
    price: "R10,000",
    period: "/month",
    tag: null,
    accent: "var(--tx-1)",
    features: [
      "Basic Monitoring",
      "4-hour P1 response SLAs",
      "10 endpoints covered",
      "Scales with data (R0.50/GB)",
    ],
  },
  {
    name: "Gold",
    price: "R25,000",
    period: "/month",
    tag: "most popular",
    accent: "#2BE9F0",
    features: [
      "Advanced Monitoring",
      "15-min P1 response SLAs",
      "Up to 20 endpoints",
      "Scales with data (R2/GB)",
      "Analyst Support included",
    ],
  },
  {
    name: "Platinum",
    price: "R30,000+",
    period: "/month",
    tag: "fully managed",
    accent: "#FC21D1",
    features: [
      "Fully Managed Operations",
      "24/7 incident response",
      "15-min P1 SLAs",
      "99.9% uptime guarantee",
      "Scalable endpoint pricing",
      "Dark Web Monitoring",
      "SIEM integration & setup",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-16 md:py-28 bg-[var(--bg-1)] relative">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="section-label">
          <span>// 005 · pricing</span>
        </div>

        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--tx-0)] mb-4">
            Our <span className="text-brand">Plans</span>
          </h2>
          <p className="text-[var(--tx-2)] text-lg max-w-xl mx-auto">
            Transparent ZAR pricing designed to grow with your business.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-[var(--bg-0)] rounded-2xl p-7 flex flex-col transition-all duration-300
                ${
                  plan.tag === "most popular"
                    ? "border border-[#2BE9F0]/40 shadow-[0_0_50px_rgba(43,233,240,0.08)]"
                    : plan.tag === "fully managed"
                      ? "border border-[#FC21D1]/35 shadow-[0_0_50px_rgba(252,33,209,0.07)]"
                      : "border border-[var(--border)]"
                }`}
            >
              {plan.tag && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="badge-pop">{plan.tag}</span>
                </div>
              )}

              <div className="mb-7">
                <span
                  className="font-mono text-xs tracking-widest uppercase block mb-2"
                  style={{ color: plan.accent }}
                >
                  {plan.name}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-3xl font-extrabold text-[var(--tx-0)]">
                    {plan.price}
                  </span>
                  <span className="font-mono text-xs text-[var(--tx-3)]">
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm text-[var(--tx-2)]"
                  >
                    <Check
                      className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                      style={{ color: plan.accent }}
                      strokeWidth={2.5}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`block text-center py-3 rounded-xl font-mono text-sm font-semibold transition-all
                  ${
                    plan.tag === "most popular" || plan.tag === "fully managed"
                      ? "text-[var(--bg-0)] bg-brand-grad hover:opacity-90"
                      : "bg-transparent border text-[var(--tx-2)] hover:text-[var(--tx-0)] hover:border-[var(--border-b)]"
                  }`}
                style={
                  !(plan.tag === "most popular" || plan.tag === "fully managed")
                    ? { borderColor: `${plan.accent}30` }
                    : {}
                }
              >
                Get started
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
