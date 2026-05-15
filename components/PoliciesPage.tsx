"use client";

import React, { useState, Suspense, lazy } from "react";
import Link from "next/link";

import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/theme";

import styles from "@/components/muchatech-policies/policies.module.css";
import type { PolicyId } from "@/components/muchatech-policies/types";

// Lazy-load each policy for code-splitting
const PrivacyPolicy = lazy(
  () => import("@/components/muchatech-policies/PrivacyPolicy"),
);
const DataProtectionPolicy = lazy(
  () => import("@/components/muchatech-policies/DataProtectionPolicy"),
);
const POPIACompliancePolicy = lazy(
  () => import("@/components/muchatech-policies/POPIACompliancePolicy"),
);
const CookiePolicy = lazy(
  () => import("@/components/muchatech-policies/CookiePolicy"),
);

interface NavItem {
  id: PolicyId;
  label: string;
  icon: string;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "privacy",
    label: "Privacy Policy",
    icon: "🔒",
    description: "Data collection & use",
  },
  {
    id: "data-protection",
    label: "Data Protection",
    icon: "🛡️",
    description: "Internal governance",
  },
  {
    id: "popia",
    label: "POPIA Compliance",
    icon: "⚖️",
    description: "8 conditions for processing",
  },
  {
    id: "cookies",
    label: "Cookie Policy",
    icon: "🍪",
    description: "Tracking & consent",
  },
];

function PolicyFallback() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        color: "var(--mt-text-muted)",
        fontFamily: "var(--mt-font-mono)",
        fontSize: 13,
        gap: 10,
      }}
    >
      <span style={{ animation: "pulse 1.2s ease-in-out infinite" }}>▋</span>
      Loading policy...
    </div>
  );
}

export default function PoliciesPage() {
  const [active, setActive] = useState<PolicyId>("privacy");
  const { isDark } = useTheme();
  return (
    // The .root class sets CSS custom properties (tokens)
    <div className={`${styles.root} ${styles.page}`}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>
            <Link href="/">MuchaTech</Link>
          </div>
          <div className={styles.sidebarLogoSub}>Legal &amp; Compliance</div>
        </div>

        <nav className={styles.sidebarNav}>
          <div className={styles.sidebarNavLabel}>Policies</div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${active === item.id ? styles.navItemActive : ""}`}
              onClick={() => setActive(item.id)}
              aria-current={active === item.id ? "page" : undefined}
            >
              <span className={styles.navIcon} aria-hidden="true">
                {item.icon}
              </span>
              <span className={styles.navTitle}>
                {item.label}
                <br />
                <span style={{ fontSize: 11, opacity: 0.6, fontWeight: 400 }}>
                  {item.description}
                </span>
              </span>
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div>MuchaTech (Pty) Ltd</div>
          <div>10520 Dungeni Street, Daveyton</div>
          <div>Benoni, Gauteng, South Africa</div>
          <div style={{ marginTop: 6 }}>security@muchatech.com</div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <Suspense fallback={<PolicyFallback />}>
        {active === "privacy" && <PrivacyPolicy />}
        {active === "data-protection" && <DataProtectionPolicy />}
        {active === "popia" && <POPIACompliancePolicy />}
        {active === "cookies" && <CookiePolicy />}
      </Suspense>
    </div>
  );
}
