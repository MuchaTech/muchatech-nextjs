"use client";

import React, { useState } from "react";
import styles from "./policies.module.css";
import {
  PolicyLayout,
  PolicySection,
  SubSection,
  Body,
  BulletList,
  Callout,
} from "./components/PolicyComponents";
import type { PolicyMeta, CookieRow } from "./types";

const META: PolicyMeta = {
  id: "cookies",
  title: "Cookie Policy",
  subtitle:
    "How MuchaTech uses cookies and similar tracking technologies on www.muchatech.com, and how you can control them.",
  icon: "🍪",
  effectiveDate: "7 May 2026",
  version: "1.0",
};

const COOKIES: CookieRow[] = [
  {
    name: "_mt_session",
    type: "Essential",
    purpose: "Maintains your authenticated session on client portal",
    duration: "Session",
    thirdParty: "No",
  },
  {
    name: "_mt_csrf",
    type: "Essential",
    purpose: "Prevents cross-site request forgery attacks on contact forms",
    duration: "Session",
    thirdParty: "No",
  },
  {
    name: "_mt_consent",
    type: "Essential",
    purpose: "Stores your cookie consent preference",
    duration: "12 months",
    thirdParty: "No",
  },
  {
    name: "_mt_lang",
    type: "Functional",
    purpose: "Remembers your language preference across sessions",
    duration: "12 months",
    thirdParty: "No",
  },
  {
    name: "_ga",
    type: "Analytics",
    purpose: "Google Analytics — tracks unique visitors and sessions",
    duration: "24 months",
    thirdParty: "Google",
  },
  {
    name: "_ga_*",
    type: "Analytics",
    purpose: "Google Analytics — stores and counts pageviews",
    duration: "24 months",
    thirdParty: "Google",
  },
  {
    name: "_gid",
    type: "Analytics",
    purpose: "Google Analytics — distinguishes users for 24 hours",
    duration: "24 hours",
    thirdParty: "Google",
  },
  {
    name: "_fbp",
    type: "Marketing",
    purpose: "Facebook Pixel — tracks ad conversions and retargeting audiences",
    duration: "90 days",
    thirdParty: "Meta",
  },
  {
    name: "li_fat_id",
    type: "Marketing",
    purpose:
      "LinkedIn Insight — measures effectiveness of LinkedIn ad campaigns",
    duration: "30 days",
    thirdParty: "LinkedIn",
  },
];

type FilterType = "All" | CookieRow["type"];

const BADGE_MAP: Record<CookieRow["type"], string> = {
  Essential: styles.badgeEssential,
  Functional: styles.badgeFunctional,
  Analytics: styles.badgeAnalytics,
  Marketing: styles.badgeMarketing,
};

function CookieTable() {
  const [filter, setFilter] = useState<FilterType>("All");
  const filters: FilterType[] = [
    "All",
    "Essential",
    "Functional",
    "Analytics",
    "Marketing",
  ];
  const visible =
    filter === "All" ? COOKIES : COOKIES.filter((c) => c.type === filter);

  return (
    <>
      {/* Filter tabs */}
      <div
        style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}
      >
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "5px 12px",
              borderRadius: 100,
              border:
                filter === f
                  ? "1px solid rgba(0,200,255,0.4)"
                  : "1px solid var(--mt-border)",
              background:
                filter === f ? "var(--mt-cyan-dim)" : "var(--mt-surface-2)",
              color: filter === f ? "var(--mt-cyan)" : "var(--mt-text-muted)",
              fontFamily: "var(--mt-font-mono)",
              fontSize: 11,
              cursor: "pointer",
              transition: "all 200ms",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.cookieTable}>
          <thead>
            <tr>
              <th>Cookie Name</th>
              <th>Type</th>
              <th>Purpose</th>
              <th>Duration</th>
              <th>Third Party</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <tr key={i}>
                <td>
                  <span className={styles.cookieName}>{row.name}</span>
                </td>
                <td>
                  <span
                    className={`${styles.cookieTypeBadge} ${BADGE_MAP[row.type]}`}
                  >
                    {row.type}
                  </span>
                </td>
                <td>{row.purpose}</td>
                <td>
                  <span
                    style={{ fontFamily: "var(--mt-font-mono)", fontSize: 12 }}
                  >
                    {row.duration}
                  </span>
                </td>
                <td>
                  <span
                    className={
                      row.thirdParty === "No"
                        ? styles.thirdPartyNo
                        : styles.thirdPartyYes
                    }
                  >
                    {row.thirdParty === "No" ? "✓ No" : `⚠ ${row.thirdParty}`}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function CookiePolicy() {
  return (
    <PolicyLayout meta={META}>
      <PolicySection number="01" title="What Are Cookies?">
        <Body>
          Cookies are small text files placed on your device (computer, tablet,
          or mobile) when you visit a website. They are widely used to make
          websites work efficiently, improve user experience, and provide
          information to website owners. Cookies may also include similar
          tracking technologies such as web beacons, pixels, and local storage.
        </Body>
      </PolicySection>

      <PolicySection number="02" title="Why MuchaTech Uses Cookies">
        <BulletList
          items={[
            "Ensure essential website functions operate correctly",
            "Remember your preferences across visits",
            "Understand how visitors use our website so we can improve it",
            "Measure the effectiveness of our marketing campaigns",
            "Comply with applicable law, including POPIA",
          ]}
        />
      </PolicySection>

      <PolicySection number="03" title="Types of Cookies We Use">
        <SubSection title="Strictly Necessary Cookies">
          <Body>
            These cookies are essential for the website to function and cannot
            be switched off without breaking core functionality. They include
            session management, security tokens, and your cookie consent
            preference. No consent is required for strictly necessary cookies.
          </Body>
        </SubSection>
        <SubSection title="Functional Cookies">
          <Body>
            Functional cookies enable enhanced features and personalisation,
            such as remembering your language preference. They do not track your
            browsing activity across other websites. Disabling them may affect
            certain website features.
          </Body>
        </SubSection>
        <SubSection title="Analytics Cookies">
          <Body>
            We use analytics cookies (Google Analytics) to collect anonymous
            information about how visitors use our website. This helps us
            improve our content and navigation. All data collected is aggregated
            and does not identify you personally.
          </Body>
        </SubSection>
        <SubSection title="Marketing Cookies">
          <Body>
            Marketing cookies are placed by our advertising partners (including
            Google, Meta, and LinkedIn) to track visits across websites and
            serve you relevant advertisements. These cookies are only activated
            with your explicit consent.
          </Body>
        </SubSection>
      </PolicySection>

      <PolicySection number="04" title="Cookie Details">
        <CookieTable />
      </PolicySection>

      <PolicySection number="05" title="Your Cookie Choices">
        <SubSection title="Cookie Consent Banner">
          <Body>
            When you first visit www.muchatech.com, a consent banner will be
            displayed. You may accept all cookies, reject non-essential cookies,
            or customise your preferences per category. Your preference is
            stored for 12 months and can be updated via the Cookie Settings link
            in the website footer.
          </Body>
        </SubSection>
        <SubSection title="Browser Settings">
          <BulletList
            items={[
              "Google Chrome: Settings → Privacy and Security → Cookies",
              "Mozilla Firefox: Options → Privacy & Security",
              "Microsoft Edge: Settings → Cookies and site permissions",
              "Safari: Preferences → Privacy",
            ]}
          />
        </SubSection>
        <SubSection title="Opt-Out of Analytics">
          <Body>
            To opt out of Google Analytics tracking across all websites, install
            the Google Analytics Opt-Out Browser Add-on at
            tools.google.com/dlpage/gaoptout.
          </Body>
        </SubSection>
        <SubSection title="Opt-Out of Marketing">
          <BulletList
            items={[
              "Google: adssettings.google.com",
              "Facebook/Meta: facebook.com/adpreferences",
              "LinkedIn: linkedin.com/psettings/advertising",
              "General opt-out: youronlinechoices.com",
            ]}
          />
        </SubSection>
      </PolicySection>

      <PolicySection number="06" title="Third-Party Cookies">
        <Body>
          Some cookies on our website are placed by third-party services.
          MuchaTech does not control these cookies; they are subject to the
          respective third-party privacy policies:
        </Body>
        <BulletList
          items={[
            "Google: policies.google.com/privacy",
            "Meta (Facebook): facebook.com/policy.php",
            "LinkedIn: linkedin.com/legal/privacy-policy",
          ]}
        />
      </PolicySection>

      <PolicySection number="07" title="Cookies and POPIA">
        <Body>
          Under POPIA, cookies that collect personal information require a
          lawful basis for processing. MuchaTech relies on:
        </Body>
        <BulletList
          items={[
            "Legitimate interest — for strictly necessary cookies required for security and website functionality",
            "Consent — for analytics and marketing cookies, obtained through our cookie consent banner",
          ]}
        />
        <Callout>
          You may withdraw consent for non-essential cookies at any time without
          affecting the lawfulness of processing carried out prior to
          withdrawal.
        </Callout>
      </PolicySection>

      <PolicySection number="08" title="Contact Us">
        <Body>
          If you have any questions about our use of cookies, please contact us
          at <strong>security@muchatech.com</strong> or write to 10520 Dungeni
          Street, Daveyton, Benoni, Gauteng, South Africa.
        </Body>
      </PolicySection>
    </PolicyLayout>
  );
}
