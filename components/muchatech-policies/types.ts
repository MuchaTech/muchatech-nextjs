export type PolicyId = "privacy" | "data-protection" | "popia" | "cookies";

export interface PolicyMeta {
  id: PolicyId;
  title: string;
  subtitle: string;
  icon: string;
  effectiveDate: string;
  version: string;
}

export interface PolicySectionProps {
  number?: string;
  title: string;
  children: React.ReactNode;
}

export interface BulletListProps {
  items: string[];
  variant?: "default" | "sub";
}

export interface InfoRowProps {
  label: string;
  value: string;
}

export interface CookieRow {
  name: string;
  type: "Essential" | "Functional" | "Analytics" | "Marketing";
  purpose: string;
  duration: string;
  thirdParty: string;
}

export interface PolicyLayoutProps {
  meta: PolicyMeta;
  children: React.ReactNode;
}
