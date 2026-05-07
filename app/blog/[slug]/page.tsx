"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  User,
  Calendar,
  PenLine,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import FooterMini from "@/components/FooterMini";
import { useTheme } from "@/lib/theme";
import { usePost, usePosts } from "@/lib/usePosts";

/* ── Markdown → HTML ──────────────────────────────────────────── */
function renderMarkdown(md: string): string {
  return (
    md
      // Headings — must come before paragraph catch-all
      .replace(
        /^### (.+)$/gm,
        '<h3 class="font-display text-xl font-bold text-[var(--tx-0)] mt-8 mb-3">$1</h3>',
      )
      .replace(
        /^## (.+)$/gm,
        '<h2 class="font-display text-2xl font-bold text-[var(--tx-0)] mt-10 mb-4 pb-2 border-b border-[var(--border)]">$1</h2>',
      )
      .replace(
        /^# (.+)$/gm,
        '<h1 class="font-display text-3xl font-bold text-[var(--tx-0)] mt-10 mb-4">$1</h1>',
      )
      // Inline formatting
      .replace(
        /\*\*(.+?)\*\*/g,
        '<strong class="font-semibold text-[var(--tx-0)]">$1</strong>',
      )
      .replace(/\*(.+?)\*/g, '<em class="italic text-[var(--tx-1)]">$1</em>')
      .replace(
        /`(.+?)`/g,
        '<code class="bg-brand-grad/10 text-[#2BE9F0] px-1.5 py-0.5 rounded font-mono text-sm">$1</code>',
      )
      // Lists
      .replace(
        /^\d+\. (.+)$/gm,
        '<li class="ml-6 list-decimal text-[var(--tx-1)] mb-2 leading-relaxed pl-1">$1</li>',
      )
      .replace(
        /^- (.+)$/gm,
        '<li class="ml-6 list-disc text-[var(--tx-1)] mb-2 leading-relaxed pl-1">$1</li>',
      )
      // Paragraphs — any non-empty line that isn't already an HTML tag
      .replace(
        /^(?!<|$)(.+)$/gm,
        '<p class="text-[var(--tx-1)] leading-[1.85] mb-4">$1</p>',
      )
      // Tidy up excess blank lines
      .replace(/\n{3,}/g, "\n\n")
  );
}

/* ── Loading skeleton ─────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="animate-pulse max-w-3xl mx-auto">
      <div className="h-3 w-32 bg-[#E1E8F4] rounded mb-8" />
      <div className="h-8 w-3/4 bg-[#E1E8F4] rounded mb-3" />
      <div className="h-8 w-1/2 bg-[#E1E8F4] rounded mb-8" />
      <div className="h-4 w-full bg-[var(--bg-1)] rounded mb-2" />
      <div className="h-4 w-5/6 bg-[var(--bg-1)] rounded mb-2" />
      <div className="h-4 w-4/6 bg-[var(--bg-1)] rounded mb-8" />
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-4 bg-[var(--bg-1)] rounded mb-3"
          style={{ width: `${80 + i * 4}%` }}
        />
      ))}
    </div>
  );
}

/* ── Generate slug from heading ──────────────────────────────────── */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/* ══════════════════════════════════════════════════════════════════
   PAGE
   Uses useParams() — the correct way to read dynamic segments in
   a 'use client' component inside the Next.js App Router.
══════════════════════════════════════════════════════════════════ */
export default function PostPage() {
  // useParams() is always synchronous and reliable in client components
  const { slug } = useParams() as { slug: string };
  const { isDark } = useTheme();

  const { post, loading } = usePost(slug);
  const { posts } = usePosts();

  const related = posts
    .filter((p) => p.published && p.id !== slug && p.tag === post?.tag)
    .slice(0, 2);

  // Extract headings for TOC
  const headings =
    post?.content
      .split("\n")
      .filter((l) => l.startsWith("## "))
      .map((l) => l.replace("## ", ""))
      .map((heading) => ({
        text: heading,
        slug: generateSlug(heading),
      })) || [];

  const handleTocClick = (headingSlug: string) => {
    const element = document.getElementById(headingSlug);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-0)]">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header className="bg-[var(--bg-0)]/90 border-b border-[var(--border)] sticky top-0 z-40 nav-blur">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <Logo height={36} variant={isDark ? "dark" : "light"} />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/blog"
              className="font-mono text-xs text-[var(--tx-2)] hover:text-[#2BE9F0] transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> All posts
            </Link>
            {!loading && post && (
              <Link
                href="/admin/blog"
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border)] text-[var(--tx-2)] font-mono text-xs rounded-lg hover:border-[#2BE9F0]/30 hover:text-[#2BE9F0] transition-colors"
              >
                <PenLine className="w-3.5 h-3.5" /> Edit
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Content ────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 py-14">
        {loading && <Skeleton />}

        {!loading && !post && (
          <div className="text-center py-24 max-w-md mx-auto">
            <BookOpen className="w-14 h-14 mx-auto mb-5 text-[#E1E8F4]" />
            <h2 className="font-display text-2xl font-bold text-[var(--tx-0)] mb-3">
              Post not found
            </h2>
            <p className="text-[var(--tx-2)] font-mono text-sm mb-8">
              This post doesn&apos;t exist or hasn&apos;t been published yet.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-grad text-white font-mono text-sm rounded-xl hover:opacity-90 transition-colors"
              >
                Browse all posts
              </Link>
              <Link
                href="/admin/blog"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-[var(--border)] text-[var(--tx-1)] font-mono text-sm rounded-xl hover:border-[#2BE9F0]/30 hover:text-[#2BE9F0] transition-colors"
              >
                <PenLine className="w-4 h-4" /> Write this post
              </Link>
            </div>
          </div>
        )}

        {!loading && post && (
          <>
            <div className="grid lg:grid-cols-4 gap-12 items-start">
              {/* ── Article ──────────────────────────────────────── */}
              <article className="lg:col-span-3">
                {/* Accent bar */}
                <div
                  className="h-1.5 rounded-t-xl mb-10"
                  style={{
                    background: `linear-gradient(90deg, ${post.accent}, transparent)`,
                  }}
                />

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 font-mono text-xs text-[var(--tx-2)] mb-8">
                  <Link
                    href="/"
                    className="hover:text-[#2BE9F0] transition-colors"
                  >
                    Home
                  </Link>
                  <span>/</span>
                  <Link
                    href="/blog"
                    className="hover:text-[#2BE9F0] transition-colors"
                  >
                    Blog
                  </Link>
                  <span>/</span>
                  <span className="text-[var(--tx-1)] truncate max-w-[200px]">
                    {post.title}
                  </span>
                </nav>

                {/* Tag */}
                <span
                  className="inline-block font-mono text-xs tracking-widest uppercase mb-4 px-3 py-1.5 rounded-full border"
                  style={{
                    color: post.accent,
                    borderColor: `${post.accent}30`,
                    backgroundColor: `${post.accent}0D`,
                  }}
                >
                  {post.tag}
                </span>

                {/* Title */}
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--tx-0)] leading-snug mb-6">
                  {post.title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 pb-8 mb-8 border-b border-[var(--border)]">
                  <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--tx-2)]">
                    <User className="w-3.5 h-3.5" /> {post.author}
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--tx-2)]">
                    <Calendar className="w-3.5 h-3.5" /> {post.date}
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--tx-2)]">
                    <Clock className="w-3.5 h-3.5" /> {post.readTime} min read
                  </div>
                </div>

                {/* Pull-quote excerpt */}
                {post.excerpt && (
                  <blockquote
                    className="text-lg text-[var(--tx-1)] leading-relaxed mb-10 pl-5 border-l-4 italic"
                    style={{ borderColor: post.accent }}
                  >
                    {post.excerpt}
                  </blockquote>
                )}

                {/* Body */}
                <div
                  className="prose-content"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(post.content).replace(
                      /^<h2[^>]*>(.+?)<\/h2>$/gm,
                      (match, heading) => {
                        const headingSlug = generateSlug(heading);
                        return `<h2 id="${headingSlug}" class="font-display text-2xl font-bold text-[var(--tx-0)] mt-10 mb-4 pb-2 border-b border-[var(--border)]">${heading}</h2>`;
                      },
                    ),
                  }}
                />

                {/* Bottom CTA */}
                <div
                  className="mt-14 p-8 rounded-2xl border"
                  style={{
                    background: `${post.accent}08`,
                    borderColor: `${post.accent}25`,
                  }}
                >
                  <h3 className="font-display text-xl font-bold text-[var(--tx-0)] mb-2">
                    Ready to secure your business?
                  </h3>
                  <p className="text-[var(--tx-1)] text-sm leading-relaxed mb-5">
                    MuchaTech provides managed cybersecurity, automation, and
                    R&amp;D for South African businesses.
                  </p>
                  <Link
                    href="/#contact"
                    className="inline-flex items-center gap-2 px-6 py-3 text-white font-mono text-sm rounded-xl transition-colors"
                    style={{ backgroundColor: post.accent }}
                  >
                    Get in touch <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>

              {/* ── Sidebar ──────────────────────────────────────── */}
              <aside className="hidden lg:block space-y-6 sticky top-24">
                {/* Table of contents */}
                {headings.length > 0 && (
                  <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl p-5 ">
                    <h4 className="font-display font-semibold text-[var(--tx-0)] text-sm mb-4">
                      In this article
                    </h4>
                    <ul className="space-y-2">
                      {headings.map((heading) => (
                        <li key={heading.slug}>
                          <button
                            onClick={() => handleTocClick(heading.slug)}
                            className="flex items-center gap-2 font-mono text-xs text-[var(--tx-2)] hover:text-[#2BE9F0] transition-colors cursor-pointer w-full text-left"
                          >
                            <span
                              className="w-1 h-1 rounded-full flex-shrink-0"
                              style={{ backgroundColor: post.accent }}
                            />
                            {heading.text}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Post stats */}
                <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl p-5 ">
                  <h4 className="font-display font-semibold text-[var(--tx-0)] text-sm mb-4">
                    Post Info
                  </h4>
                  <div className="space-y-3 font-mono text-xs">
                    {(
                      [
                        ["Category", post.tag],
                        ["Read time", `${post.readTime} min`],
                        ["Published", post.date],
                        [
                          "Words",
                          String(
                            post.content.split(/\s+/).filter(Boolean).length,
                          ),
                        ],
                      ] as [string, string][]
                    ).map(([label, value]) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-[var(--tx-2)]">{label}</span>
                        <span className="text-[var(--tx-0)] font-medium">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Write CTA */}
                <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl p-5 ">
                  <Link
                    href="/admin/blog"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-grad text-white font-mono text-xs rounded-xl hover:opacity-90 transition-colors"
                  >
                    <PenLine className="w-3.5 h-3.5" /> Write a new post
                  </Link>
                </div>
              </aside>
            </div>

            {/* ── Related posts ─────────────────────────────────── */}
            {related.length > 0 && (
              <section className="mt-16 pt-10 border-t border-[var(--border)]">
                <h2 className="font-display text-2xl font-bold text-[var(--tx-0)] mb-6">
                  More in <span className="text-gradient">{post.tag}</span>
                </h2>
                <div className="grid md:grid-cols-2 gap-5">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={`/blog/${r.id}`}
                      className="group bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl overflow-hidden  card-hover flex"
                    >
                      <div
                        className="w-1.5 flex-shrink-0"
                        style={{ backgroundColor: r.accent }}
                      />
                      <div className="p-6">
                        <span
                          className="font-mono text-xs uppercase tracking-widest mb-2 block"
                          style={{ color: r.accent }}
                        >
                          {r.tag}
                        </span>
                        <h3 className="font-display font-bold text-[var(--tx-0)] leading-snug group-hover:text-[#2BE9F0] transition-colors mb-2">
                          {r.title}
                        </h3>
                        <span
                          className="flex items-center gap-1 font-mono text-xs mt-3"
                          style={{ color: r.accent }}
                        >
                          Read{" "}
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <FooterMini />
    </div>
  );
}
