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
  id: "privacy",
  title: "Privacy Policy",
  subtitle:
    "How MuchaTech collects, uses and protects your personal information when you engage with our services or visit www.muchatech.com.",
  icon: "🔒",
  effectiveDate: "7 May 2026",
  version: "1.0",
};

export default function PrivacyPolicy() {
  return (
    <PolicyLayout meta={META}>
      <PolicySection number="01" title="Introduction">
        <Body>
          MuchaTech (Pty) Ltd ("MuchaTech", "we", "us" or "our") is a
          cybersecurity operations company based in Daveyton, Benoni, Gauteng,
          South Africa. We are committed to protecting the privacy and security
          of all personal information entrusted to us by our clients, website
          visitors, and partners. This Privacy Policy explains what information
          we collect, why we collect it, how we use it, and the rights you have
          in relation to it.
        </Body>
        <Body>
          This policy applies to all services provided by MuchaTech — including
          Managed Cybersecurity, SOCaaS, Security Penetration Testing, Security
          Automation, Dark Web Monitoring, Automation &amp; Tools, and
          Cybersecurity R&amp;D — as well as your use of www.muchatech.com.
        </Body>
      </PolicySection>

      <PolicySection number="02" title="Who We Are">
        <InfoGrid
          rows={[
            { label: "Company Name", value: "MuchaTech (Pty) Ltd" },
            {
              label: "Physical Address",
              value:
                "10520 Dungeni Street, Daveyton, Benoni, Gauteng, South Africa",
            },
            { label: "General Email", value: "support@muchatech.com" },
            { label: "Privacy Email", value: "security@muchatech.com" },
            { label: "Website", value: "www.muchatech.com" },
          ]}
        />
      </PolicySection>

      <PolicySection number="03" title="Information We Collect">
        <SubSection title="Information You Provide Directly">
          <BulletList
            items={[
              "Full name and job title",
              "Company name and business address",
              "Email address and telephone number",
              "Nature of your cybersecurity or automation enquiry",
              "Payment and billing information for service subscriptions",
              "Content of messages or communications sent to us",
            ]}
          />
        </SubSection>
        <SubSection title="Information Collected Automatically">
          <BulletList
            items={[
              "IP address and browser type",
              "Pages visited and time spent on our website",
              "Referring website or search terms used to find us",
              "Device type, operating system, and screen resolution",
              "Cookie identifiers (see our Cookie Policy for full details)",
            ]}
          />
        </SubSection>
        <SubSection title="Information From Third Parties">
          <Body>
            We may receive information about you from business partners,
            referral sources, or publicly available records when this is
            necessary to provide our services or respond to an enquiry.
          </Body>
        </SubSection>
      </PolicySection>

      <PolicySection number="04" title="How We Use Your Information">
        <Body>
          We use your personal information only for legitimate business
          purposes, including:
        </Body>
        <BulletList
          items={[
            "Responding to enquiries and providing quotations for our services",
            "Delivering contracted cybersecurity, automation, and SOC services",
            "Processing payments and managing billing for our Silver, Gold, and Platinum plans",
            "Sending service updates, security alerts relevant to your environment, and administrative notices",
            "Improving our website, services, and client communications",
            "Complying with applicable South African laws and regulations, including POPIA",
            "Conducting internal security research and threat intelligence activities",
            "Marketing our services where you have given consent or where a legitimate interest exists",
          ]}
        />
      </PolicySection>

      <PolicySection number="05" title="Legal Basis for Processing">
        <Body>
          We process your personal information on the following lawful grounds
          under POPIA:
        </Body>
        <BulletList
          items={[
            "Contractual necessity – to perform services you have engaged us for",
            "Legitimate interests – to operate, maintain, and improve our business",
            "Legal obligation – to comply with South African law",
            "Consent – for marketing communications and cookies, which you may withdraw at any time",
          ]}
        />
      </PolicySection>

      <PolicySection number="06" title="How We Share Your Information">
        <Callout>
          MuchaTech does not sell, rent, or trade personal information under any
          circumstances.
        </Callout>
        <SubSection title="Service Providers">
          <Body>
            Trusted third-party vendors who assist in delivering our services —
            such as cloud hosting providers, payment processors
            (POPIA-compliant), and communication platforms. All such parties are
            contractually obligated to handle your data securely and only for
            the purposes we specify.
          </Body>
        </SubSection>
        <SubSection title="Legal Requirements">
          <Body>
            We may disclose information where required by law, court order, or
            regulatory authority, or where disclosure is necessary to protect
            the rights, property, or safety of MuchaTech, our clients, or the
            public.
          </Body>
        </SubSection>
        <SubSection title="Business Transfers">
          <Body>
            In the event of a merger, acquisition, or sale of business assets,
            personal information may be transferred as part of that transaction,
            subject to equivalent privacy protections.
          </Body>
        </SubSection>
      </PolicySection>

      <PolicySection number="07" title="Data Retention">
        <Body>
          We retain personal information for as long as necessary to fulfil the
          purposes outlined in this policy, or as required by law:
        </Body>
        <BulletList
          items={[
            "Client account and contract records: 5 years after contract end",
            "Website enquiry and contact data: 2 years",
            "Financial and billing records: 7 years (per South African tax law)",
            "Security incident logs: 3 years",
          ]}
        />
        <Body>
          After the applicable retention period, data is securely destroyed or
          anonymised.
        </Body>
      </PolicySection>

      <PolicySection number="08" title="Your Rights">
        <Body>Under POPIA and applicable law, you have the right to:</Body>
        <BulletList
          items={[
            "Access a copy of the personal information we hold about you",
            "Correct inaccurate or incomplete personal information",
            "Request deletion of your data where there is no lawful reason to retain it",
            "Object to the processing of your data for direct marketing purposes",
            "Lodge a complaint with the Information Regulator of South Africa",
          ]}
        />
        <Callout>
          To exercise any of these rights, please contact us at
          security@muchatech.com. We will respond within 30 calendar days.
        </Callout>
      </PolicySection>

      <PolicySection number="09" title="Security">
        <Body>
          As a cybersecurity company, data security is at the core of everything
          we do. We implement technical and organisational measures — including
          encryption, access controls, intrusion detection, and regular security
          assessments — to protect personal information against unauthorised
          access, disclosure, alteration, or destruction.
        </Body>
      </PolicySection>

      <PolicySection number="10" title="International Transfers">
        <Body>
          Where we transfer personal information outside South Africa, we ensure
          adequate protections are in place in accordance with POPIA Section 72,
          including data transfer agreements with recipients.
        </Body>
      </PolicySection>

      <PolicySection number="11" title="Contact Us">
        <InfoGrid
          rows={[
            { label: "DPO", value: "MuchaTech (Pty) Ltd" },
            { label: "Email", value: "security@muchatech.com" },
            {
              label: "Address",
              value:
                "10520 Dungeni Street, Daveyton, Benoni, Gauteng, South Africa",
            },
          ]}
        />
        <Body>
          You may also contact the Information Regulator of South Africa at
          www.justice.gov.za/inforeg or inforeg@justice.gov.za.
        </Body>
      </PolicySection>
    </PolicyLayout>
  );
}
