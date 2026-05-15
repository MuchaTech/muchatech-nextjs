# MuchaTech Policy Components

React + TypeScript components for the four MuchaTech legal policy pages, styled with the brand palette (Electric Cyan · Hot Magenta · Warm Charcoal).

## File Structure

```
muchatech-policies/
├── types.ts                          # Shared TypeScript types
├── policies.module.css               # All styles (CSS custom properties)
├── PoliciesPage.tsx                  # Main page — sidebar + lazy-loaded panels
├── PrivacyPolicy.tsx                 # Privacy Policy document
├── DataProtectionPolicy.tsx          # Data Protection Policy document
├── POPIACompliancePolicy.tsx         # POPIA Compliance Policy document
├── CookiePolicy.tsx                  # Cookie Policy document (filterable table)
└── components/
    └── PolicyComponents.tsx          # Shared primitives (Layout, Section, Bullet, etc.)
```

## Integration (Next.js App Router)

### 1. Copy files
Drop the entire `muchatech-policies/` folder into your `app/` or `components/` directory.

### 2. Add fonts to `app/layout.tsx`
```tsx
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';

const syne = Syne({ subsets: ['latin'], variable: '--font-syne' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
```
Then update the CSS variables in `policies.module.css`:
```css
--mt-font-display: var(--font-syne), sans-serif;
--mt-font-body:    var(--font-dm), sans-serif;
--mt-font-mono:    var(--font-mono), monospace;
```

### 3. Create the route `app/legal/page.tsx`
```tsx
import PoliciesPage from '@/components/muchatech-policies/PoliciesPage';
export default function LegalPage() {
  return <PoliciesPage />;
}
```

### 4. Link individual policies with deep-linking (optional)
Replace the `useState` in `PoliciesPage.tsx` with `useSearchParams` for URL-driven navigation:
```tsx
import { useSearchParams, useRouter } from 'next/navigation';
const searchParams = useSearchParams();
const active = (searchParams.get('tab') as PolicyId) ?? 'privacy';
// then: router.push(`?tab=${id}`) on button click
```

## Customisation

| Token | Default | Purpose |
|---|---|---|
| `--mt-cyan` | `#00c8ff` | Primary accent, active states, heading borders |
| `--mt-magenta` | `#e01070` | Secondary accent, sub-headers, alerts |
| `--mt-bg` | `#080812` | Page background |
| `--mt-surface` | `#0f0f1e` | Sidebar / card surfaces |
| `--mt-text` | `#c8d0e8` | Body text |

Override any token in your global CSS:
```css
:root {
  --mt-cyan: #00e5ff;   /* brighter cyan */
}
```

## Components API

### `<PolicySection number="01" title="Introduction">`
Renders a numbered section with cyan underline heading.

### `<SubSection title="Details">`
Renders a magenta small-caps sub-heading with trailing rule.

### `<BulletList items={[...]} variant="default | sub" />`
Renders a styled bullet list. Sub-variant uses a smaller marker.

### `<InfoGrid rows={[{ label, value }]} />`
Renders a two-column monospace key-value grid.

### `<Callout variant="cyan | magenta">`
Renders a highlighted callout box.
