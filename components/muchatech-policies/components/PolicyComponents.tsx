"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "../policies.module.css";
import type {
  PolicyLayoutProps,
  PolicySectionProps,
  BulletListProps,
  InfoRowProps,
} from "../types";

// ── <PolicyLayout> ─────────────────────────────────────────────────────────────
export function PolicyLayout({ meta, children }: PolicyLayoutProps) {
  const mainRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const pct = scrollTop / (scrollHeight - clientHeight);
      setProgress(Math.min(1, Math.max(0, pct)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={mainRef} className={styles.main}>
      <div
        className={styles.progressBar}
        style={{ transform: `scaleX(${progress})` }}
      />
      <div className={styles.document}>
        {/* Cover */}
        <div className={styles.cover}>
          <div className={styles.coverTag}>
            <span className={styles.coverTagDot} />
            Legal &amp; Compliance
          </div>
          <h1 className={styles.coverTitle}>
            {meta.title.split(" ").map((word, i) =>
              i === 0 ? (
                <span key={i} className={styles.coverTitleAccent}>
                  {word}{" "}
                </span>
              ) : (
                <React.Fragment key={i}>{word} </React.Fragment>
              ),
            )}
          </h1>
          <p className={styles.coverSubtitle}>{meta.subtitle}</p>
          <div className={styles.coverMeta}>
            <span className={styles.coverBadge}>v{meta.version}</span>
            <span className={styles.coverBadge}>
              Effective: {meta.effectiveDate}
            </span>
            <span
              className={`${styles.coverBadge} ${styles.coverBadgeHighlight}`}
            >
              {meta.icon} {meta.title}
            </span>
            <span className={styles.coverBadge}>MuchaTech (Pty) Ltd</span>
          </div>
        </div>

        {/* Sections */}
        {children}
      </div>
    </div>
  );
}

// ── <PolicySection> ────────────────────────────────────────────────────────────
export function PolicySection({ number, title, children }: PolicySectionProps) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        {number && <span className={styles.sectionNumber}>{number}</span>}
        <h2 className={styles.sectionTitle}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ── <SubSection> ───────────────────────────────────────────────────────────────
export function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.subSection}>
      <div className={styles.subSectionTitle}>{title}</div>
      {children}
    </div>
  );
}

// ── <Body> ─────────────────────────────────────────────────────────────────────
export function Body({ children }: { children: React.ReactNode }) {
  return <p className={styles.body}>{children}</p>;
}

// ── <BulletList> ───────────────────────────────────────────────────────────────
export function BulletList({ items, variant = "default" }: BulletListProps) {
  return (
    <ul className={styles.bulletList}>
      {items.map((item, i) => (
        <li key={i} className={styles.bulletItem}>
          <span className={styles.bulletDot}>
            {variant === "sub" ? "◦" : "▸"}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ── <InfoGrid> ─────────────────────────────────────────────────────────────────
export function InfoGrid({ rows }: { rows: InfoRowProps[] }) {
  return (
    <div className={styles.infoGrid}>
      {rows.map(({ label, value }, i) => (
        <div key={i} className={styles.infoRow}>
          <div className={styles.infoLabel}>{label}</div>
          <div className={styles.infoValue}>{value}</div>
        </div>
      ))}
    </div>
  );
}

// ── <Callout> ──────────────────────────────────────────────────────────────────
export function Callout({
  children,
  variant = "cyan",
}: {
  children: React.ReactNode;
  variant?: "cyan" | "magenta";
}) {
  return (
    <div
      className={`${styles.callout} ${variant === "magenta" ? styles.calloutMagenta : ""}`}
    >
      {children}
    </div>
  );
}
