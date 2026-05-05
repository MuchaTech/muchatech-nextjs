"use client";
import NavbarMini from "@/components/NavbarMini";
import FooterMini from "@/components/FooterMini";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-0)]">
      <NavbarMini />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12 text-center">
          <h1>Privacy Policy</h1>
          <p>This is the Privacy Policy page.</p>
        </div>
      </main>
      <FooterMini />
    </div>
  );
}
