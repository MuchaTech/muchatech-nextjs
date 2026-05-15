"use client";

/**
 * MarkdownRenderer
 *
 * Converts markdown to React elements with special handling for:
 *   ```mermaid  — renders as <MermaidChart>
 *   ```code     — renders as a styled code block with copy button
 *   All other markdown — rendered safely via react-markdown
 */

import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

// Lazy-load Mermaid so it never blocks the page
const MermaidChart = dynamic(() => import("@/components/MermaidChart"), {
  ssr: false,
});

/* ── Code block with copy ────────────────────────────────────────── */
function CodeBlock({ node, inline, className, children, ...props }: any) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const lang = match ? match[1] : "";

  if (inline) {
    return (
      <code className="md-code" {...props}>
        {children}
      </code>
    );
  }

  const code = String(children).replace(/\n$/, "");

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="my-6 rounded-xl overflow-hidden border"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{ backgroundColor: "var(--bg-1)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
          {lang && (
            <span
              className="font-mono text-xs ml-2"
              style={{ color: "var(--tx-3)" }}
            >
              {lang}
            </span>
          )}
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 font-mono text-xs px-2 py-1 rounded-lg border transition-all"
          style={{
            color: copied ? "#2BE9F0" : "var(--tx-3)",
            borderColor: copied ? "rgba(43,233,240,0.3)" : "var(--border)",
          }}
        >
          {copied ? (
            <Check className="w-3 h-3" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      {/* Code */}
      <pre
        className="p-4 md:p-5 overflow-x-auto text-sm leading-relaxed"
        style={{
          backgroundColor: "var(--bg-0)",
          color: "var(--tx-1)",
          fontFamily: '"JetBrains Mono", monospace',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ── Custom component map for react-markdown ────────────────────── */
function createComponentMap() {
  return {
    code: CodeBlock,
    // Enhanced mermaid detection
    pre: ({ children }: any) => {
      // Check if code block is mermaid
      const codeElement = children?.[0];
      const codeContent = codeElement?.props?.children?.[0];
      const className = codeElement?.props?.className || "";

      if (className.includes("language-mermaid") && codeContent) {
        const key = `mermaid-${Math.random()}`;
        return <MermaidChart key={key} chart={codeContent} id={key} />;
      }

      return <pre>{children}</pre>;
    },
    // Styled heading overrides
    h1: ({ node, ...props }: any) => <h1 className="md-h1" {...props} />,
    h2: ({ node, ...props }: any) => <h2 className="md-h2" {...props} />,
    h3: ({ node, ...props }: any) => <h3 className="md-h3" {...props} />,
    blockquote: ({ node, ...props }: any) => (
      <blockquote className="md-bq" {...props} />
    ),
    a: ({ node, ...props }: any) => (
      <a
        className="md-link"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    strong: ({ node, ...props }: any) => (
      <strong className="md-strong" {...props} />
    ),
    em: ({ node, ...props }: any) => <em className="md-em" {...props} />,
    hr: ({ node, ...props }: any) => <hr className="md-hr" {...props} />,
    ul: ({ node, ...props }: any) => <ul className="md-ul" {...props} />,
    ol: ({ node, ...props }: any) => <ol className="md-ol" {...props} />,
    li: ({ node, ...props }: any) => <li className="md-uli" {...props} />,
    p: ({ node, ...props }: any) => <p className="md-p" {...props} />,
  };
}

/* ── Main component ──────────────────────────────────────────────── */
export default function MarkdownRenderer({ content }: { content: string }) {
  const components = useMemo(() => createComponentMap(), []);

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
