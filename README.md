# MuchaTech — Next.js Redesign

A production-ready Next.js 14 redesign of [muchatech.com](https://muchatech.com), built with the App Router, TypeScript, and Tailwind CSS.

## Tech Stack

- **Next.js 14** — App Router, TypeScript
- **Tailwind CSS 3** — custom brand palette
- **Lucide React** — icon system
- **Google Fonts** — JetBrains Mono · DM Sans · Space Grotesk

## Brand Colours

| Token | Hex | Usage |
|---|---|---|
| `--cyan` | `#00C8FF` | Primary accent, CTAs, links |
| `--green-neon` | `#00FF94` | Secondary accent, success states |
| `--bg-primary` | `#080A0F` | Page background |
| `--bg-secondary` | `#0E1118` | Section alternates |
| `--bg-card` | `#111520` | Card surfaces |
| `--bg-border` | `#1A2030` | Dividers, borders |
| `--text-primary` | `#E8EDF5` | Headings, body |
| `--text-secondary` | `#8A97B0` | Muted body copy |
| `--text-muted` | `#4A5568` | Labels, captions |

## Sections

| Section | Description |
|---|---|
| `Navbar` | Sticky blur navbar, dropdown services menu, mobile hamburger |
| `Hero` | Canvas particle-network animation, animated headline |
| `About` | 3-pillar layout + interactive terminal card |
| `Services` | Cybersecurity · Automation · R&D icon card grids |
| `Skills` | Intersection-observer-triggered animated progress bars |
| `Portfolio` | Filterable project cards (All / Dev / Cyber / Automation) |
| `Stats` | Animated counters on scroll |
| `Pricing` | 4-tier plans in ZAR (Free → Platinum) |
| `Testimonials` | Quote cards |
| `Blog` | Latest post cards |
| `Contact` | Full form with validation, select dropdowns, POPIA consent |
| `Footer` | Brand links, legal, social, terminal tagline |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

## Notes

- Contact form submission is stubbed with a 1.2s delay — wire up to your API endpoint in `Contact.tsx > submit()`
- The particle canvas in `Hero.tsx` is client-side only (`'use client'`)
- All colour tokens are in `app/globals.css` as CSS variables and in `tailwind.config.js` as theme extensions
- POPIA compliance copy and consent checkbox match the original site's declaration
