"use client";
import FooterMini from "@/components/FooterMini";
import NavbarMini from "@/components/NavbarMini";

export default function DataProtectionPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-0)]">
      <NavbarMini />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12 text-center">
          <h1>Data Protection</h1>
          <p>This is the Data Protection page.</p>
        </div>
      </main>
      <FooterMini />
    </div>
  );
}
