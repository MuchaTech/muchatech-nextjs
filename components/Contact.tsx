"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

const bizAreas = [
  "Cybersecurity",
  "Automation Tools",
  "Research & Development",
];
const reqTypes = ["Plans Inquiry", "Purchase Request", "General Inquiry"];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessArea: "",
    requestType: "",
    message: "",
    consent: String(false),
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<String | null>("");

  const handle = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const t = e.target;
    setForm((p) => ({
      ...p,
      [t.name]:
        t instanceof HTMLInputElement && t.type === "checkbox"
          ? (t as HTMLInputElement).checked
          : t.value,
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Send the form data to Formspree
    try {
      const res = await fetch(
        `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone || "—",
            businessArea: form.businessArea,
            requestType: form.requestType,
            message: form.message,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(
          data?.errors?.[0]?.message ?? "Submission failed. Please try again.",
        );
        return;
      }

      setSent(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-[var(--bg-0)] border border-[var(--border)] rounded-xl px-4 py-3 font-mono text-sm text-[var(--tx-0)] placeholder-[var(--tx-3)] outline-none transition-all hover:border-[var(--border-b)]";

  return (
    <section
      id="contact"
      className="py-28 bg-[var(--bg-0)] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-[radial-gradient(ellipse_at_80%_0%,rgba(43,233,240,0.07)_0%,transparent_60%)]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-[radial-gradient(ellipse_at_20%_100%,rgba(252,33,209,0.06)_0%,transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="section-label">
          <span>// 008 · contact</span>
        </div>

        <div className="grid lg:grid-cols-5 gap-14">
          {/* Left */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-[var(--tx-0)] leading-tight mb-4">
              Secure Your
              <br />
              <span className="text-brand">Business</span> Today.
            </h2>
            <p className="text-[var(--tx-2)] mb-10 leading-relaxed">
              Reach out and let&apos;s discuss how we can protect your digital
              assets.
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: MapPin,
                  label: "Location",
                  value: "10520 Dungeni Street, Daveyton, Benoni, Gauteng",
                  accent: "#2BE9F0",
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: "+27 60 526 8882",
                  href: "tel:+27605268882",
                  accent: "#FC21D1",
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: "support@muchatech.com",
                  href: "mailto:support@muchatech.com",
                  accent: "#2BE9F0",
                },
              ].map(({ icon: Icon, label, value, href, accent }) => (
                <div key={label} className="flex gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center"
                    style={{
                      borderColor: `${accent}25`,
                      backgroundColor: `${accent}0D`,
                    }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: accent }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <div className="font-mono text-xs text-[var(--tx-3)] uppercase tracking-widest mb-1">
                      {label}
                    </div>
                    {href ? (
                      <a
                        href={href}
                        className="text-[var(--tx-1)] hover:text-[#2BE9F0] transition-colors text-sm"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-[var(--tx-1)] text-sm leading-relaxed">
                        {value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Response times */}
            <div className="mt-10 p-5 bg-[var(--bg-1)] border border-[var(--border)] rounded-xl">
              <div className="font-mono text-sm space-y-2">
                <p className="text-[var(--tx-3)]">// response times</p>
                <p>
                  <span className="text-[#2BE9F0]">P1 </span>
                  <span className="text-[var(--tx-2)]">Critical </span>
                  <span className="text-[var(--tx-0)]">15 min</span>
                </p>
                <p>
                  <span className="text-[#FC21D1]">P2 </span>
                  <span className="text-[var(--tx-2)]">High </span>
                  <span className="text-[var(--tx-0)]">4 hrs</span>
                </p>
                <p>
                  <span className="text-[var(--tx-2)]">P3 </span>
                  <span className="text-[var(--tx-2)]">Standard </span>
                  <span className="text-[var(--tx-0)]">24 hrs</span>
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
                  <div className="w-16 h-16 rounded-full border-2 border-[#2BE9F0]/40 flex items-center justify-center bg-[#2BE9F0]/08">
                    <CheckCircle
                      className="w-8 h-8 text-[#2BE9F0]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[var(--tx-0)]">
                    Message Sent!
                  </h3>
                  <p className="text-[var(--tx-2)] max-w-xs">
                    We&apos;ll be in touch shortly. Your security matters to us.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setError(null);
                      setForm({
                        name: "",
                        email: "",
                        phone: "",
                        businessArea: "",
                        requestType: "",
                        message: "",
                        consent: String(false),
                      });
                    }}
                    className="mt-4 font-mono text-sm text-[#2BE9F0] hover:text-[#FC21D1] transition-colors"
                  >
                    Send another →
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5">
                  {/* Terminal header */}
                  <div className="flex items-center gap-2 pb-4 mb-2 border-b border-[var(--border)]">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
                    </div>
                    <span className="font-mono text-xs text-[var(--tx-3)] ml-2">
                      contact_form.sh
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      {
                        name: "name",
                        label: "Full Name",
                        type: "text",
                        placeholder: "Your name",
                      },
                      {
                        name: "email",
                        label: "Email",
                        type: "email",
                        placeholder: "you@company.co.za",
                      },
                    ].map((f) => (
                      <div key={f.name}>
                        <label className="block font-mono text-xs text-[var(--tx-3)] uppercase tracking-widest mb-1.5">
                          {f.label}
                        </label>
                        <input
                          name={f.name}
                          type={f.type}
                          placeholder={f.placeholder}
                          value={(form as Record<string, string>)[f.name]}
                          onChange={handle}
                          required
                          className={inputCls}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-[var(--tx-3)] uppercase tracking-widest mb-1.5">
                      Phone (optional)
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      placeholder="+27 XX XXX XXXX"
                      value={form.phone}
                      onChange={handle}
                      className={inputCls}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      {
                        name: "businessArea",
                        label: "Business Area",
                        opts: bizAreas,
                      },
                      {
                        name: "requestType",
                        label: "Request Type",
                        opts: reqTypes,
                      },
                    ].map((f) => (
                      <div key={f.name}>
                        <label className="block font-mono text-xs text-[var(--tx-3)] uppercase tracking-widest mb-1.5">
                          {f.label}
                        </label>
                        <select
                          name={f.name}
                          value={(form as Record<string, string>)[f.name]}
                          onChange={handle}
                          required
                          className={`${inputCls} appearance-none cursor-pointer`}
                        >
                          <option value="" disabled>
                            Select…
                          </option>
                          {f.opts.map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-[var(--tx-3)] uppercase tracking-widest mb-1.5">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="Describe your security needs…"
                      value={form.message}
                      onChange={handle}
                      required
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex-shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        name="consent"
                        checked={String(form.consent) === "true"}
                        onChange={handle}
                        required
                        className="peer sr-only"
                      />
                      <div className="w-4 h-4 rounded border border-[var(--border)] bg-[var(--bg-0)] peer-checked:border-[#2BE9F0]/60 peer-checked:bg-[#2BE9F0]/10 transition-all" />
                      {form.consent && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-2 h-2 rounded-sm bg-[#2BE9F0]" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-[var(--tx-3)] leading-relaxed group-hover:text-[var(--tx-2)] transition-colors">
                      I agree that my data will be collected and processed to
                      answer my request. Revoke at{" "}
                      <a
                        href="mailto:security@muchatech.com"
                        className="text-[#2BE9F0]"
                      >
                        security@muchatech.com
                      </a>
                      .
                    </span>
                  </label>
                  {/*Error message*/}
                  {error && (
                    <p className="font-mono text-xs text-[#FC21D1] bg-[#FC21D1]/08 border border-[#FC21D1]/20 rounded-xl px-4 py-3">
                      ⚠ {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={loading || !form.consent}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-display font-bold text-sm text-[var(--bg-0)] bg-brand-grad hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed glow-cyan"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-[var(--bg-0)]/30 border-t-[var(--bg-0)] rounded-full animate-spin" />{" "}
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
