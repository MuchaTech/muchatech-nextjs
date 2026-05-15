"use client";

import React from "react";
import {
  PolicyLayout,
  PolicySection,
  SubSection,
  Body,
  BulletList,
  InfoGrid,
  Callout,
} from "./components/PolicyComponents";
import type { PolicyMeta } from "./types";

const META: PolicyMeta = {
  id: "data-protection",
  title: "Data Protection Policy",
  subtitle:
    "Internal policy governing the handling, storage, and processing of personal data by MuchaTech personnel, contractors, and partners.",
  icon: "🛡️",
  effectiveDate: "7 May 2026",
  version: "1.0",
};

export default function DataProtectionPolicy() {
  return (
    <PolicyLayout meta={META}>
      <PolicySection number="01" title="Purpose and Scope">
        <Body>
          This Data Protection Policy establishes the obligations of MuchaTech
          (Pty) Ltd and all personnel, contractors, and third-party partners
          with respect to the collection, storage, processing, and sharing of
          personal information. It is designed to ensure compliance with the
          Protection of Personal Information Act 4 of 2013 (POPIA) and other
          applicable South African legislation.
        </Body>
        <Body>
          This policy applies to all personal information processed by MuchaTech
          regardless of medium — electronic, paper, or verbal — and covers all
          business activities including Managed Cybersecurity, SOCaaS,
          Penetration Testing, Security Automation, and R&amp;D operations.
        </Body>
      </PolicySection>

      <PolicySection number="02" title="Definitions">
        <InfoGrid
          rows={[
            {
              label: "Personal Information",
              value:
                "Any information relating to an identifiable, living natural person or existing juristic person as defined in POPIA.",
            },
            {
              label: "Data Subject",
              value: "The person to whom personal information relates.",
            },
            {
              label: "Responsible Party",
              value:
                "MuchaTech (Pty) Ltd, as the entity that determines the purpose and means of processing.",
            },
            {
              label: "Operator",
              value:
                "A third party who processes personal information for MuchaTech.",
            },
            {
              label: "Processing",
              value:
                "Any operation performed on personal information, including collection, storage, use, dissemination, and destruction.",
            },
            {
              label: "Information Officer",
              value:
                "The designated MuchaTech employee accountable for POPIA compliance.",
            },
          ]}
        />
      </PolicySection>

      <PolicySection number="03" title="Data Protection Principles">
        <Body>
          All personal information processed by MuchaTech must comply with the
          following eight conditions for lawful processing under POPIA:
        </Body>
        <BulletList
          items={[
            "Accountability – MuchaTech ensures compliance and takes responsibility for processing activities.",
            "Processing Limitation – Personal information is collected only for specific, lawful purposes with the knowledge or consent of the data subject.",
            "Purpose Specification – Data collected for one purpose is not used for a different, incompatible purpose without fresh consent.",
            "Further Processing Limitation – Further processing is compatible with the original purpose.",
            "Information Quality – Reasonable steps are taken to ensure data is accurate, complete, and up to date.",
            "Openness – Data subjects are informed about what data is collected, why, and how it is used.",
            "Security Safeguards – Appropriate technical and organisational measures protect personal information.",
            "Data Subject Participation – Data subjects may request access to and correction of their personal information.",
          ]}
        />
      </PolicySection>

      <PolicySection number="04" title="Roles and Responsibilities">
        <SubSection title="Information Officer">
          <Body>
            The appointed Information Officer bears ultimate accountability for
            POPIA compliance at MuchaTech. Responsibilities include registering
            with the Information Regulator, maintaining the data processing
            register, and handling data subject requests and complaints.
          </Body>
        </SubSection>
        <SubSection title="All Staff and Contractors">
          <BulletList
            items={[
              "Handle personal information only as required by their role",
              "Report suspected data breaches immediately to the Information Officer",
              "Complete mandatory data protection awareness training",
              "Comply with this policy and all related procedures",
            ]}
          />
        </SubSection>
        <SubSection title="Operators (Third-Party Processors)">
          <Body>
            All operators engaged by MuchaTech must sign a Data Processing
            Agreement (DPA) that obligates them to process personal information
            only on MuchaTech's instructions and to implement adequate security
            measures.
          </Body>
        </SubSection>
      </PolicySection>

      <PolicySection number="05" title="Data Classification">
        <BulletList
          items={[
            "Confidential – Personally identifiable information, authentication credentials, financial records, client security configurations",
            "Internal – Operational data, internal communications, service delivery records",
            "Public – Marketing material, published blog posts, publicly available company information",
          ]}
        />
      </PolicySection>

      <PolicySection number="06" title="Data Collection and Consent">
        <Body>Personal information is collected only when:</Body>
        <BulletList
          items={[
            "Necessary to fulfil a contractual obligation with the data subject",
            "Required by applicable law",
            "The data subject has given informed, voluntary consent",
          ]}
        />
        <Body>
          Consent is obtained through clear, unambiguous language and is
          documented. Data subjects are informed of their right to withdraw
          consent at any time.
        </Body>
      </PolicySection>

      <PolicySection number="07" title="Data Storage and Security">
        <Body>
          MuchaTech applies the following security controls for all personal
          information:
        </Body>
        <BulletList
          items={[
            "Encryption at rest and in transit using industry-standard algorithms",
            "Role-based access control (RBAC) to limit access to authorised personnel only",
            "Multi-factor authentication (MFA) on all systems processing personal information",
            "Regular vulnerability assessments and penetration tests on data infrastructure",
            "Secure disposal of data using approved data sanitisation methods",
            "Physical access controls for any on-premises data storage",
            "Incident response procedures tested and reviewed annually",
          ]}
        />
      </PolicySection>

      <PolicySection number="08" title="Data Breach Response">
        <BulletList
          items={[
            "The incident must be reported to the Information Officer within 24 hours of discovery",
            "MuchaTech will investigate and contain the breach within 72 hours",
            "Where required by POPIA, the Information Regulator and affected data subjects will be notified without undue delay",
            "A post-incident review will be conducted to identify root cause and prevent recurrence",
          ]}
        />
        <Callout variant="magenta">
          A detailed Incident Response Plan is maintained separately and
          reviewed annually.
        </Callout>
      </PolicySection>

      <PolicySection number="09" title="Data Retention and Disposal">
        <BulletList
          items={[
            "Employment records: Duration of employment + 5 years",
            "Client contracts and service records: 5 years after contract termination",
            "Financial records: 7 years (SARS requirement)",
            "Security incident records: 3 years",
            "Marketing consent records: Until withdrawal of consent + 1 year",
          ]}
        />
        <Body>
          At end of retention, data is securely deleted or rendered permanently
          anonymous.
        </Body>
      </PolicySection>

      <PolicySection number="10" title="Third-Party and Cross-Border Transfers">
        <Body>
          MuchaTech does not transfer personal information to third parties
          outside South Africa without ensuring that the receiving country or
          organisation provides an equivalent level of protection as required
          under POPIA Section 72.
        </Body>
      </PolicySection>

      <PolicySection number="11" title="Training and Awareness">
        <Body>
          All MuchaTech employees and contractors receive data protection
          training upon onboarding and at least annually thereafter. The
          Information Officer monitors compliance and provides refresher
          training following any regulatory changes or incidents.
        </Body>
      </PolicySection>

      <PolicySection number="12" title="Contact">
        <InfoGrid
          rows={[
            { label: "Information Officer", value: "MuchaTech (Pty) Ltd" },
            { label: "Email", value: "security@muchatech.com" },
            {
              label: "Address",
              value:
                "10520 Dungeni Street, Daveyton, Benoni, Gauteng, South Africa",
            },
            { label: "Next Review", value: "7 May 2027" },
          ]}
        />
      </PolicySection>
    </PolicyLayout>
  );
}
