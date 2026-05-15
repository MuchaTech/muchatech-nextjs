import {
  Shield,
  Cpu,
  FlaskConical,
  Lock,
  Eye,
  Bot,
  Wifi,
  Brain,
  Atom,
  Network,
  Tablet,
} from "lucide-react";

const services = [
  {
    id: "cybersecurity",
    icon: Shield,
    accent: "#2BE9F0",
    tag: "managed security",
    title: "Cybersecurity Operations",
    description:
      "Securing your business assets from all domains without fail. Zero trust architecture to 24/7 SOC monitoring.",
    items: [
      {
        icon: Lock,
        label: "Security Architecture & Engineering",
        desc: "Zero trust redesign and implementation to protect organisation assets.",
      },
      {
        icon: Eye,
        label: "MDR — 24/7 SOC",
        desc: "Day-to-day monitoring, threat detection and incident response.",
      },
      {
        icon: Shield,
        label: "Continuous Assessments",
        desc: "Proactive audits, pen-testing and environment scanning.",
      },
      {
        icon: Lock,
        label: "Penetration Testing",
        desc: "Black Box cyberattack simulation to uncover vulnerabilities.",
      },
      {
        icon: Eye,
        label: "Privacy & Anonymity",
        desc: "Keeping personal information and online activities protected.",
      },
      {
        icon: Shield,
        label: "Dark Web Monitoring",
        desc: "Monitor and respond to security events in the dark web.",
      },
    ],
  },
  {
    id: "automation",
    icon: Cpu,
    accent: "#FC21D1",
    tag: "automation & tools",
    title: "Automation & Tools",
    description:
      "Automating repetitive tasks and workflows for productivity and faster product delivery at scale.",
    items: [
      {
        icon: Bot,
        label: "ICS Automation",
        desc: "Automate physical processes through hardware and software.",
      },
      {
        icon: Cpu,
        label: "SOAR",
        desc: "Integrate tools to automate incident detection and remediation.",
      },
      {
        icon: Bot,
        label: "RPA",
        desc: "Automates log monitoring, threat detection and compliance reporting.",
      },
    ],
  },
  {
    id: "rd",
    icon: FlaskConical,
    accent: "#2BE9F0",
    tag: "R&D",
    title: "Cybersecurity R&D",
    description:
      "Tomorrow's threats, solved today. Pioneering SA's cyber future through Secure SDLC.",
    items: [
      {
        icon: Brain,
        label: "AI & ML Security",
        desc: "Boosting threat detection and protecting AI from adversarial attacks.",
      },
      {
        icon: Lock,
        label: "Privacy-Enhancing Tech",
        desc: "Enabling data analysis while protecting individual privacy.",
      },
      {
        icon: Atom,
        label: "Quantum Cryptography",
        desc: "Preparing for quantum computers that could break current encryption.",
      },
      {
        icon: Network,
        label: "Network Security",
        desc: "Protect sensitive data and maintain customer trust.",
      },
      {
        icon: Wifi,
        label: "IoT & Cyber-Physical",
        desc: "Securing connected devices from smart homes to industrial systems.",
      },
      {
        icon: Tablet,
        label: "Human-Centred Security",
        desc: "Understanding and mitigating the human element risk.",
      },
    ],
  },
];

export default function Services() {
  return (
    <section id="services" className="py-16 md:py-28 bg-[var(--bg-1)] relative">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="section-label">
          <span>// 002 · services</span>
        </div>

        <div className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--tx-0)] mb-4">
            Proactive Services &<br />
            <span className="text-brand">Incredible Features</span>
          </h2>
          <p className="text-[var(--tx-2)] text-lg max-w-xl">
            Assisting businesses in secure growth is at the core of what we do.
          </p>
        </div>

        <div className="space-y-20">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div key={svc.id} id={svc.id}>
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center border"
                    style={{
                      borderColor: `${svc.accent}30`,
                      backgroundColor: `${svc.accent}0D`,
                    }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: svc.accent }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <span
                      className="font-mono text-xs tracking-widest uppercase block mb-0.5"
                      style={{ color: svc.accent }}
                    >
                      {svc.tag}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-[var(--tx-0)]">
                      {svc.title}
                    </h3>
                  </div>
                </div>
                <p className="text-[var(--tx-2)] mb-8 max-w-2xl">
                  {svc.description}
                </p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {svc.items.map(({ icon: ItemIcon, label, desc }) => (
                    <div
                      key={label}
                      className="card-hover bg-[var(--bg-0)] border border-[var(--border)] rounded-xl p-5 group cursor-default"
                    >
                      <div className="flex items-start gap-3">
                        <ItemIcon
                          className="w-4 h-4 mt-0.5 flex-shrink-0 transition-colors"
                          style={{ color: svc.accent }}
                          strokeWidth={1.5}
                        />
                        <div>
                          <h4 className="font-display font-semibold text-[var(--tx-0)] text-sm mb-1.5">
                            {label}
                          </h4>
                          <p className="text-[var(--tx-2)] text-xs leading-relaxed">
                            {desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-16 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
