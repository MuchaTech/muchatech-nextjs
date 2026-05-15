export interface BlogPost {
  id: string;
  title: string;
  tag: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  readTime: number;
  published: boolean;
  accent: string;
}

export const defaultPosts: BlogPost[] = [
  {
    id: "zta-implementation",
    title:
      "Zero Trust Architecture: Replacing Perimeter Security in Modern Cybersecurity",
    tag: "Zero Trust Architecture",
    excerpt:
      "ZTA marks a paradigm shift in cybersecurity. Traditional perimeter-based models fail against insider threats, remote work, and cloud breaches. Zero Trust eliminates implicit trust.",
    content: `## What is Zero Trust Architecture?

Zero Trust Architecture (ZTA)—as defined in NIST SP 800-207—marks a **paradigm shift in cybersecurity**. Traditional perimeter-based models assume everything inside the network is safe. ZTA challenges this by verifying every request regardless of origin.

## Core Principles

The three pillars of Zero Trust are:

- **Verify explicitly** — Always authenticate and authorise based on all available data points
- **Use least-privilege access** — Limit user access with just-in-time and just-enough-access policies
- **Assume breach** — Minimise blast radius and segment access, verify end-to-end encryption

## ZTA Request Flow

\`\`\`mermaid
flowchart LR
  U([User / Device]) -->|1 Request| PE[Policy Engine]
  PE -->|2 Evaluate| PA[(Policy\nAdministrator)]
  PA -->|3 Trust Score| PE
  PE -->|4 Allow / Deny| PEP[Policy\nEnforcement\nPoint]
  PEP -->|5 Forwarded| R([Resource])
  PE -->|Logs| SIEM[(SIEM)]
\`\`\`

## Why Traditional Security Fails

Traditional perimeter security creates a hard shell around a soft interior. Once an attacker breaches the perimeter — through phishing, stolen credentials, or supply chain compromise — they move laterally with little resistance.

Modern threats including remote work, cloud adoption, and SaaS sprawl have dissolved the traditional perimeter entirely.

## Implementation Roadmap

1. Identify sensitive data, assets, applications, and services
2. Map transaction flows
3. Architect a Zero Trust network
4. Create Zero Trust policies
5. Monitor and maintain`,
    date: "2025-03-15",
    author: "MuchaTech Team",
    readTime: 6,
    published: true,
    accent: "#2BE9F0",
  },
  {
    id: "security-health-check",
    title: "A Proactive Approach to Protecting Your Domain",
    tag: "Cybersecurity Health Check",
    excerpt:
      "A security health check systematically reviews your domain's security posture, uncovering vulnerabilities that attackers could exploit before they do.",
    content: `## What is a Security Health Check?

A security health check is a systematic review of your organisation's security posture. It uncovers vulnerabilities that attackers could exploit — before they do.

## Assessment Process

\`\`\`mermaid
sequenceDiagram
  participant C as Client
  participant MT as MuchaTech
  participant R as Report

  C->>MT: Initial consultation
  MT->>MT: Scope definition
  MT->>C: Questionnaire
  C->>MT: Data & access
  MT->>MT: Six-domain assessment
  MT->>R: Generate findings
  R->>C: Executive summary
  R->>C: Technical report
  MT->>C: 30-day follow-up
\`\`\`

## What We Assess

Our health check covers six key domains:

- **Email security** — SPF, DKIM, DMARC, phishing susceptibility
- **Endpoint hygiene** — Patch levels, AV coverage, EDR deployment
- **Network exposure** — Open ports, misconfigurations, firewall rules
- **Identity & Access** — MFA adoption, privilege sprawl, stale accounts
- **Data protection** — Encryption at rest and in transit, DLP controls
- **Compliance posture** — POPIA readiness, ISO 27001 gap analysis

## Deliverables

After the assessment you receive:

1. Executive summary with risk ratings
2. Technical findings report
3. Prioritised remediation roadmap
4. 30-day follow-up call

## Get Started

Contact MuchaTech to schedule your complimentary initial consultation.`,
    date: "2025-01-22",
    author: "MuchaTech Team",
    readTime: 4,
    published: true,
    accent: "#FC21D1",
  },
];
