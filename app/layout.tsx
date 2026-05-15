import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/theme";

export const metadata: Metadata = {
  title: "MuchaTech — Cybersecurity Ops",
  description:
    "We confidently protect your business. Cybersecurity Operations, Automation & Tools, and R&D for South African businesses.",
  keywords:
    "cybersecurity, penetration testing, SOC, POPIA, South Africa, security automation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /*
     * `dark` class is set here as the server-rendered default.
     * ThemeProvider overwrites it on the client after reading
     * localStorage / prefers-color-scheme — with no flash because
     * the CSS transition only kicks in after the first paint.
     */
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
