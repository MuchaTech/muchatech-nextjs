"use client";
/**
 * MermaidChart — renders a Mermaid diagram from a definition string.
 * Loads mermaid lazily from CDN so it never bloats the main bundle.
 *
 * Supports: flowchart, sequence, class, state, ER, Gantt, pie,
 *           timeline, git, C4, mindmap, xychart
 */
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/theme";

interface Props {
  chart: string;
  id?: string;
}

let mermaidLoaded = false;
let mermaidReady = false;
const waiters: (() => void)[] = [];

function loadMermaid(): Promise<void> {
  return new Promise((resolve) => {
    if (mermaidReady) {
      resolve();
      return;
    }
    waiters.push(resolve);
    if (mermaidLoaded) return;

    mermaidLoaded = true;
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
    script.async = true;
    script.onload = () => {
      mermaidReady = true;
      waiters.forEach((fn) => fn());
      waiters.length = 0;
    };
    document.head.appendChild(script);
  });
}

export default function MermaidChart({
  chart,
  id = `mmd-${Math.random().toString(36).slice(2)}`,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      setLoading(true);
      setError(null);
      try {
        await loadMermaid();
        if (cancelled || !ref.current) return;

        // Configure theme before each render
        const w = window as Window & {
          mermaid?: {
            initialize: (c: object) => void;
            render: (id: string, def: string) => Promise<{ svg: string }>;
          };
        };
        if (!w.mermaid) return;

        w.mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          themeVariables: isDark
            ? {
                primaryColor: "#0A0D13",
                primaryTextColor: "#F2F6FF",
                primaryBorderColor: "#2BE9F0",
                lineColor: "#606880",
                secondaryColor: "#0E1119",
                tertiaryColor: "#111520",
                background: "#06080C",
                mainBkg: "#0A0D13",
                nodeBorder: "#2BE9F0",
                clusterBkg: "#0E1119",
                titleColor: "#2BE9F0",
                edgeLabelBackground: "#0A0D13",
                fontFamily: '"JetBrains Mono", monospace',
              }
            : {
                primaryColor: "#EBF0FA",
                primaryTextColor: "#0B1220",
                primaryBorderColor: "#2BE9F0",
                lineColor: "#697899",
                secondaryColor: "#F4F7FD",
                tertiaryColor: "#FFFFFF",
                background: "#FFFFFF",
                mainBkg: "#F4F7FD",
                nodeBorder: "#2BE9F0",
                clusterBkg: "#EBF0FA",
                titleColor: "#2BE9F0",
                edgeLabelBackground: "#FFFFFF",
                fontFamily: '"JetBrains Mono", monospace',
              },
        });

        const uniqueId = `${id}-${Date.now()}`;
        const { svg } = await w.mermaid.render(uniqueId, chart.trim());
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (e) {
        if (!cancelled) setError(String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [chart, isDark, id]);

  return (
    <div
      className="my-6 rounded-xl overflow-hidden border"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Header bar */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b"
        style={{ backgroundColor: "var(--bg-1)", borderColor: "var(--border)" }}
      >
        <span className="font-mono text-xs" style={{ color: "var(--tx-3)" }}>
          diagram
        </span>
        <div className="flex-1" />
        <span
          className="font-mono text-xs px-2 py-0.5 rounded-full border text-brand"
          style={{ borderColor: "rgba(43,233,240,0.25)" }}
        >
          mermaid
        </span>
      </div>

      {/* Diagram area */}
      <div
        className="p-4 md:p-6 flex items-center justify-center min-h-[120px]"
        style={{ backgroundColor: "var(--bg-0)" }}
      >
        {loading && (
          <div className="flex flex-col items-center gap-3 py-6">
            <div
              className="w-6 h-6 border-2 rounded-full animate-spin"
              style={{
                borderColor: "var(--border-b)",
                borderTopColor: "#2BE9F0",
              }}
            />
            <span
              className="font-mono text-xs"
              style={{ color: "var(--tx-3)" }}
            >
              Rendering diagram…
            </span>
          </div>
        )}
        {error && (
          <div
            className="p-4 rounded-lg border w-full"
            style={{
              backgroundColor: "rgba(252,33,209,0.06)",
              borderColor: "rgba(252,33,209,0.25)",
            }}
          >
            <p className="font-mono text-xs mb-1" style={{ color: "#FC21D1" }}>
              Diagram error
            </p>
            <pre
              className="font-mono text-xs overflow-x-auto whitespace-pre-wrap"
              style={{ color: "var(--tx-2)" }}
            >
              {error}
            </pre>
          </div>
        )}
        <div
          ref={ref}
          className="w-full overflow-x-auto [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:mx-auto"
          style={{ display: loading || error ? "none" : "block" }}
        />
      </div>
    </div>
  );
}
