"use client";

import React from "react";
import { useState } from "react";
import styles from "./policies.module.css";
import {
  PolicyLayout,
  PolicySection,
  Body,
  BulletList,
  InfoGrid,
  Callout,
} from "./components/PolicyComponents";
import type { PolicyMeta } from "./types";

const META: PolicyMeta = {
  id: "popia",
  title: "POPIA Compliance",
  subtitle:
    "MuchaTech's compliance framework under the Protection of Personal Information Act 4 of 2013, aligned to all eight conditions for lawful processing.",
  icon: "⚖️",
  effectiveDate: "7 May 2026",
  version: "1.0",
};

interface ConditionProps {
  num: string;
  name: string;
  section: string;
  body: string;
  bullets?: string[];
}

interface Condition {
  num: string;
  name: string;
  section: string;
  body: string;
  bullets?: string[];
}

const CONDITIONS: Condition[] = [
  {
    num: "01",
    name: "Accountability",
    section: "Section 8",
    body: "MuchaTech has appointed an Information Officer who is registered with the Information Regulator of South Africa. The Information Officer ensures that POPIA obligations are understood, implemented, and monitored across the organisation.",
  },
  {
    num: "02",
    name: "Processing Limitation",
    section: "Sections 9–12",
    body: "Personal information is processed only:",
    bullets: [
      "With the knowledge or consent of the data subject",
      "Where processing is necessary to carry out contractual obligations",
      "Where legitimate interests do not override the data subject's right to privacy",
    ],
  },
  {
    num: "03",
    name: "Purpose Specification",
    section: "Sections 13–14",
    body: "Personal information is collected for a specific, explicitly defined, and lawful purpose. It is not processed in a manner incompatible with that purpose. Data subjects are informed of the purpose at the time of collection.",
  },
  {
    num: "04",
    name: "Further Processing Limitation",
    section: "Section 15",
    body: "Any further processing of personal information must be compatible with the original purpose for which it was collected. Where incompatible further processing is required, fresh consent is obtained from the data subject.",
  },
  {
    num: "05",
    name: "Information Quality",
    section: "Section 16",
    body: "MuchaTech takes reasonable steps to ensure that personal information is accurate, complete, and updated where necessary. Clients and contacts are encouraged to notify us of any changes to their information.",
  },
  {
    num: "06",
    name: "Openness",
    section: "Sections 17–18",
    body: "MuchaTech maintains a publicly accessible Privacy Policy at www.muchatech.com. At the time of collection, data subjects are informed of: the identity of the responsible party, the purpose of collection, whether provision is voluntary or mandatory, and the consequences of failing to provide information.",
  },
  {
    num: "07",
    name: "Security Safeguards",
    section: "Sections 19–22",
    body: "As a cybersecurity company, MuchaTech applies rigorous technical and organisational security measures:",
    bullets: [
      "Encryption of personal data at rest and in transit",
      "Role-based access controls and least-privilege principles",
      "Regular penetration testing of systems holding personal information",
      "Documented incident response and breach notification procedures",
      "Operator (third-party) agreements requiring equivalent security standards",
    ],
  },
  {
    num: "08",
    name: "Data Subject Participation",
    section: "Sections 23–25",
    body: "Data subjects have the right to:",
    bullets: [
      "Request confirmation of whether MuchaTech holds their personal information",
      "Request a record or description of their personal information",
      "Request correction, destruction, or deletion of their information",
      "Object to the processing of their personal information",
    ],
  },
];

const CHECKLIST_ITEMS = [
  "Information Officer appointed and registered",
  "PAIA Manual maintained and publicly available",
  "Privacy Notice published on website",
  "Data Processing Register maintained",
  "Data Processing Agreements with all operators",
  "Staff data protection training completed",
  "Consent management processes implemented",
  "Data retention schedules applied",
  "Breach notification procedures tested",
  "Cross-border transfer controls in place",
];

function ConditionCard({ num, name, section, body, bullets }: ConditionProps) {
  const [open, setOpen] = useState(false);

  // return (
  //   <div
  //     style={{
  //       border: `1px solid ${open ? "rgba(0,200,255,0.3)" : T.border}`,
  //       borderRadius: 10,
  //       overflow: "hidden",
  //       marginBottom: 10,
  //       transition: "border-color 200ms",
  //       boxShadow: open ? "0 0 20px rgba(0,200,255,0.12)" : "none",
  //     }}
  //   >
  //     {/* ── Header / toggle button ── */}
  //     <button
  //       onClick={() => setOpen((o) => !o)}
  //       style={{
  //         width: "100%",
  //         display: "flex",
  //         alignItems: "center",
  //         gap: 14,
  //         padding: "13px 18px",
  //         background: T.surface2,
  //         border: "none",
  //         cursor: "pointer",
  //         borderBottom: open ? `1px solid ${T.border}` : "none",
  //         textAlign: "left",
  //       }}
  //     >
  //       {/* Condition number badge */}
  //       <span
  //         style={{
  //           fontFamily: "monospace",
  //           fontSize: 11,
  //           padding: "3px 8px",
  //           background: T.cyanDim,
  //           border: "1px solid rgba(0,200,255,0.25)",
  //           color: T.cyan,
  //           borderRadius: 4,
  //           letterSpacing: "0.06em",
  //         }}
  //       >
  //         §{num}
  //       </span>

  //       {/* Condition name */}
  //       <span
  //         style={{
  //           fontFamily: "'Syne','Segoe UI',sans-serif",
  //           fontSize: 15,
  //           fontWeight: 700,
  //           color: T.heading,
  //           flex: 1,
  //         }}
  //       >
  //         {name}
  //       </span>

  //       {/* POPIA section reference */}
  //       <span style={{ fontFamily: "monospace", fontSize: 11, color: T.muted }}>
  //         {section}
  //       </span>

  //       {/* Expand chevron */}
  //       <span
  //         style={{
  //           color: T.cyan,
  //           fontSize: 12,
  //           transition: "transform 200ms",
  //           transform: open ? "rotate(90deg)" : "none",
  //         }}
  //       >
  //         ▶
  //       </span>
  //     </button>

  //     {/* ── Expandable body ── */}
  //     {open && (
  //       <div
  //         style={{
  //           padding: "14px 18px",
  //           fontSize: 14,
  //           lineHeight: 1.7,
  //           color: T.text,
  //         }}
  //       >
  //         <p style={{ margin: "0 0 8px" }}>{body}</p>
  //         {bullets && (
  //           <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
  //             {bullets.map((b, i) => (
  //               <li key={i} style={{ marginBottom: 4 }}>
  //                 {b}
  //               </li>
  //             ))}
  //           </ul>
  //         )}
  //       </div>
  //     )}
  //   </div>
  // );
  return (
    <div
      style={{
        border: open ? "1px solid rgba(0,200,255,0.3)" : "1px solid #1e1e38",
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 10,
        transition: "border-color 200ms",
        boxShadow: open ? "0 0 20px rgba(0,200,255,0.12)" : "none",
      }}
    >
      {/* ── Header / toggle button ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "13px 18px",
          background: "#161628",
          border: "none",
          cursor: "pointer",
          borderBottom: open ? "1px solid #1e1e38" : "none",
          textAlign: "left",
        }}
      >
        {/* Condition number badge */}
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            padding: "3px 8px",
            background: "rgba(0,200,255,0.10)",
            border: "1px solid rgba(0,200,255,0.25)",
            color: "#00c8ff",
            borderRadius: 4,
            letterSpacing: "0.06em",
            flexShrink: 0,
          }}
        >
          {num}
        </span>

        {/* Condition name */}
        <span
          style={{
            fontFamily: "'Syne','Segoe UI',sans-serif",
            fontSize: 15,
            fontWeight: 700,
            color: "#e8ecf8",
            flex: 1,
          }}
        >
          {name}
        </span>

        {/* POPIA section reference */}
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            color: "#606880",
            flexShrink: 0,
          }}
        >
          {section}
        </span>

        {/* Expand chevron */}
        <span
          style={{
            color: "#00c8ff",
            fontSize: 12,
            transition: "transform 200ms",
            transform: open ? "rotate(90deg)" : "none",
            flexShrink: 0,
          }}
        >
          ▶
        </span>
      </button>

      {/* ── Expandable body ── */}
      {open && (
        <div
          style={{
            padding: "14px 18px",
            fontSize: 14,
            lineHeight: 1.7,
            color: "#c8d0e8",
            background: "#0f0f1e",
          }}
        >
          <p style={{ margin: "0 0 8px" }}>{body}</p>
          {bullets && (
            <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
              {bullets.map((b, i) => (
                <li key={i} style={{ marginBottom: 4, color: "#c8d0e8" }}>
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function POPIACompliancePolicy() {
  return (
    <PolicyLayout meta={META}>
      <PolicySection number="01" title="Legislative Framework">
        <Body>
          The Protection of Personal Information Act 4 of 2013 (POPIA) is the
          primary data protection legislation in South Africa. It came into full
          effect on 1 July 2021. POPIA regulates the processing of personal
          information by public and private bodies to promote the protection of
          privacy while balancing it with other rights and values.
        </Body>
        <Body>
          MuchaTech (Pty) Ltd, as a responsible party under POPIA, is committed
          to full compliance with all eight conditions for lawful processing and
          to upholding the rights of data subjects.
        </Body>
      </PolicySection>

      <PolicySection
        number="02"
        title="The Eight Conditions for Lawful Processing"
      >
        <Body>
          MuchaTech implements compliance measures aligned to each of the
          following POPIA conditions:
        </Body>
        <p>Click any condition to expand MuchaTech's implementation details</p>

        {CONDITIONS.map((c) => (
          // <div key={c.num} className={styles.conditionCard}>
          //   <div className={styles.conditionHeader}>
          //     <span className={styles.conditionNum}>{c.num}</span>
          //     <span className={styles.conditionName}>{c.name}</span>
          //     <span className={styles.conditionRef}>{c.section}</span>
          //   </div>
          //   <div className={styles.conditionBody}>
          //     <p style={{ margin: "0 0 8px", lineHeight: 1.7 }}>{c.body}</p>
          //     {c.bullets && (
          //       <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
          //         {c.bullets.map((b, i) => (
          //           <li key={i} style={{ marginBottom: 4, lineHeight: 1.65 }}>
          //             {b}
          //           </li>
          //         ))}
          //       </ul>
          //     )}
          //   </div>
          // </div>
          <ConditionCard
            key={c.num}
            num={c.num}
            name={c.name}
            section={c.section}
            body={c.body}
            bullets={c.bullets}
          />
        ))}
      </PolicySection>

      <PolicySection number="03" title="Special Categories of Information">
        <Body>
          POPIA grants enhanced protection to the following special categories:
        </Body>
        <BulletList
          items={[
            "Religious or philosophical beliefs",
            "Race or ethnic origin",
            "Trade union membership",
            "Political persuasion",
            "Health or sex life",
            "Biometric information",
            "Criminal behaviour",
            "Children's personal information",
          ]}
        />
        <Callout variant="magenta">
          MuchaTech does not collect special categories of personal information
          unless strictly necessary for a specific purpose, and only with
          explicit consent or as permitted by POPIA.
        </Callout>
      </PolicySection>

      <PolicySection number="04" title="Direct Marketing">
        <Body>
          MuchaTech engages in direct marketing only where the data subject:
        </Body>
        <BulletList
          items={[
            "Has provided explicit consent, or",
            "Is an existing client who has not opted out (legitimate interest basis)",
          ]}
        />
        <Body>
          Every marketing communication includes a clear opt-out mechanism.
          Opt-out requests are honoured within 5 business days.
        </Body>
      </PolicySection>

      <PolicySection number="05" title="Information Officer">
        <Body>
          As required by POPIA Section 55, MuchaTech's Information Officer is
          responsible for:
        </Body>
        <BulletList
          items={[
            "Ensuring compliance with POPIA across the organisation",
            "Processing data subject requests, queries, and complaints",
            "Working with the Information Regulator",
            "Conducting POPIA impact assessments for new processing activities",
            "Maintaining the processing activities register",
          ]}
        />
        <InfoGrid
          rows={[
            { label: "IO Contact", value: "security@muchatech.com" },
            { label: "Info Regulator", value: "www.justice.gov.za/inforeg" },
            { label: "Regulator Email", value: "inforeg@justice.gov.za" },
          ]}
        />
      </PolicySection>

      <PolicySection number="06" title="POPIA Compliance Checklist">
        <Body>
          MuchaTech reviews compliance against the following checklist at least
          annually:
        </Body>
        <div className={styles.checklist}>
          {CHECKLIST_ITEMS.map((item, i) => (
            <div key={i} className={styles.checkItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </PolicySection>

      <PolicySection number="07" title="Complaints and Enforcement">
        <Body>
          Data subjects who believe MuchaTech has processed their information
          unlawfully may:
        </Body>
        <BulletList
          items={[
            "Submit a complaint to MuchaTech's Information Officer at security@muchatech.com",
            "Lodge a complaint with the Information Regulator of South Africa if not satisfied with MuchaTech's response",
          ]}
        />
      </PolicySection>

      <PolicySection number="08" title="Version Control">
        <InfoGrid
          rows={[
            { label: "Current Version", value: "1.0" },
            { label: "Effective Date", value: "7 May 2026" },
            { label: "Next Review", value: "7 May 2027" },
            {
              label: "Governing Law",
              value: "Republic of South Africa — POPIA Act 4 of 2013",
            },
          ]}
        />
      </PolicySection>
    </PolicyLayout>
  );
}
