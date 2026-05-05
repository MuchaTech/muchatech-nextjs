export type ToolCategory =
  | "Security"
  | "Automation"
  | "Monitoring"
  | "Compliance";
export type ToolLicense = "one-time" | "monthly" | "annual";

export interface Tool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  license: ToolLicense;
  price: number; // ZAR, cents-free number e.g. 1999
  originalPrice?: number; // for showing a discount
  features: string[];
  badge?: string; // e.g. "New", "Popular", "Beta"
  accent: string;
  icon: string; // emoji fallback icon
  downloadUrl?: string; // after purchase
  docsUrl?: string;
}

export const tools: Tool[] = [
  {
    id: "netwatch-pro",
    name: "NetWatch Pro",
    tagline: "Real-time network threat visualisation",
    description:
      "NetWatch Pro scans your network continuously, maps live connections, flags anomalies and generates POPIA-ready PDF reports in one click. Built for South African SMEs and enterprise environments.",
    category: "Monitoring",
    license: "annual",
    price: 3600,
    originalPrice: 5400,
    badge: "Popular",
    accent: "#0094CC",
    icon: "🛡️",
    features: [
      "Live network topology map",
      "Automated anomaly detection",
      "POPIA-ready PDF reports",
      "Email + Slack alerting",
      "Up to 500 endpoints",
      "1 year updates & support",
    ],
    docsUrl: "#",
  },
  {
    id: "vulnscan-lite",
    name: "VulnScan Lite",
    tagline: "Automated vulnerability scanning for SMEs",
    description:
      "Schedule and run automated vulnerability scans against your web apps, APIs and internal services. Get prioritised CVE reports with remediation guidance tailored to your stack.",
    category: "Security",
    license: "monthly",
    price: 799,
    badge: "New",
    accent: "#00A86B",
    icon: "🔍",
    features: [
      "Web app & API scanning",
      "CVE prioritisation engine",
      "Remediation playbooks",
      "CI/CD pipeline integration",
      "Up to 10 targets/scan",
      "Monthly rolling licence",
    ],
    docsUrl: "#",
  },
  {
    id: "soar-toolkit",
    name: "SOAR Toolkit",
    tagline: "Security orchestration & automation starter kit",
    description:
      "A battle-tested library of 40+ incident response playbooks, SIEM integration scripts and automation workflows. Drop into your existing stack and cut response times by up to 70%.",
    category: "Automation",
    license: "one-time",
    price: 4999,
    originalPrice: 7500,
    accent: "#0094CC",
    icon: "⚙️",
    features: [
      "40+ IR playbooks (YAML/JSON)",
      "Splunk, QRadar & Elastic scripts",
      "Slack/Teams bot templates",
      "Threat intel feed connectors",
      "Lifetime access & updates",
      "Community Discord access",
    ],
    docsUrl: "#",
  },
  {
    id: "popia-checker",
    name: "POPIA Checker",
    tagline: "POPIA compliance gap analysis tool",
    description:
      "Answer 80 guided questions across 8 POPIA conditions and get an instant compliance score, a gap report and a prioritised remediation roadmap — in under 30 minutes.",
    category: "Compliance",
    license: "one-time",
    price: 1499,
    badge: "New",
    accent: "#00A86B",
    icon: "📋",
    features: [
      "80-question assessment engine",
      "Compliance score dashboard",
      "Printable gap-analysis report",
      "Prioritised remediation roadmap",
      "POPIA conditions 1–8 coverage",
      "Reusable — unlimited runs",
    ],
    docsUrl: "#",
  },
  {
    id: "darkweb-monitor",
    name: "DarkWeb Monitor",
    tagline: "Credential leak detection & dark web alerting",
    description:
      "Continuously monitors dark web marketplaces and paste sites for your domain, employee email addresses and API keys. Instant alerts the moment your data appears where it shouldn't.",
    category: "Monitoring",
    license: "monthly",
    price: 1299,
    originalPrice: 1599,
    badge: "Popular",
    accent: "#0094CC",
    icon: "🌐",
    features: [
      "Domain + email monitoring",
      "API key & secret detection",
      "Instant WhatsApp / email alerts",
      "30-day breach history",
      "Up to 5 domains",
      "Cancel anytime",
    ],
    docsUrl: "#",
  },
  {
    id: "pentest-report-gen",
    name: "PenTest Report Gen",
    tagline: "Professional penetration test report generator",
    description:
      "Import findings from Burp Suite, Nessus or manual notes and generate polished, client-ready PDF penetration test reports in minutes. Includes executive summary, technical detail and risk matrix templates.",
    category: "Security",
    license: "one-time",
    price: 2499,
    accent: "#00A86B",
    icon: "📝",
    features: [
      "Burp Suite & Nessus import",
      "Executive + technical templates",
      "CVSS risk scoring matrix",
      "White-label branding options",
      "Editable Word + PDF export",
      "Lifetime licence",
    ],
    docsUrl: "#",
  },
];
