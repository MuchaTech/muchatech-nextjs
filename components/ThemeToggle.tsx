"use client";
import { useTheme } from "@/theme";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const { isDark, toggle, mounted } = useTheme();

  // Render a static placeholder until JS hydrates, prevents layout shift
  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-lg border border-[var(--border)] ${className}`}
      />
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`relative w-9 h-9 rounded-lg border border-[var(--border)] flex items-center justify-center
        text-[var(--tx-2)] hover:text-[var(--tx-0)] hover:border-[var(--border-b)]
        transition-all duration-200 group overflow-hidden ${className}`}
      style={{ backgroundColor: "var(--bg-1)" }}
    >
      {/* Animated background sweep on hover */}
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(255,210,100,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(43,233,240,0.12) 0%, transparent 70%)",
        }}
      />

      {isDark ? (
        <Sun
          className="relative w-4 h-4 text-[#FFBD2E] group-hover:scale-110 transition-transform duration-200"
          strokeWidth={1.5}
        />
      ) : (
        <Moon
          className="relative w-4 h-4 text-[#2BE9F0] group-hover:scale-110 transition-transform duration-200"
          strokeWidth={1.5}
        />
      )}
    </button>
  );
}
