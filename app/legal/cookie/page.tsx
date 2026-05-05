"use client";
import NavbarMini from "@/components/NavbarMini";
import FooterMini from "@/components/FooterMini";

export default function CookiePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-0)]">
      <NavbarMini />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12 text-center">
          <h1>Cookie Policy</h1>
          <p>This is the Cookie Policy page.</p>
        </div>
      </main>
      <FooterMini />
    </div>
  );
}
