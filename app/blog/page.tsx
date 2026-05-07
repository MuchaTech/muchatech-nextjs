"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  User,
  PenLine,
  Search,
  BookOpen,
} from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import FooterMini from "@/components/FooterMini";
import { useTheme } from "@/lib/theme";
import { usePosts } from "@/lib/usePosts";

function Skeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl overflow-hidden animate-pulse"
        >
          <div className="h-1.5 bg-[#E1E8F4]" />
          <div className="p-7 space-y-3">
            <div className="h-3 w-24 bg-[#E1E8F4] rounded" />
            <div className="h-5 w-full bg-[#E1E8F4] rounded" />
            <div className="h-5 w-3/4 bg-[#E1E8F4] rounded" />
            <div className="h-4 w-full bg-[var(--bg-1)] rounded mt-2" />
            <div className="h-4 w-5/6 bg-[var(--bg-1)] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BlogPage() {
  const { posts, loading } = usePosts();
  const { isDark } = useTheme();
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const published = posts.filter((p) => p.published);

  const allTags = Array.from(
    new Set(published.map((p) => p.tag).filter(Boolean)),
  );

  const filtered = published.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      p.tag.toLowerCase().includes(search.toLowerCase());
    const matchTag = !activeTag || p.tag === activeTag;
    return matchSearch && matchTag;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-[var(--bg-0)]">
      {/* Nav */}
      <header className="bg-[var(--bg-0)]/90 border-b border-[var(--border)] sticky top-0 z-40 nav-blur">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <Logo height={36} variant={isDark ? "dark" : "light"} />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="font-mono text-xs text-[var(--tx-2)] hover:text-[#2BE9F0] transition-colors mr-1"
            >
              ← Back to site
            </Link>
            <ThemeToggle />
            <Link
              href="/admin/blog"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-grad text-[var(--bg-0)] font-mono text-xs rounded-lg hover:opacity-90 transition-opacity"
            >
              <PenLine className="w-3.5 h-3.5" /> New Post
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--bg-1)] border border-[var(--border)] rounded-full mb-6 shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-[#2BE9F0]" />
            <span className="font-mono text-xs text-[var(--tx-2)] tracking-widest uppercase">
              Cybersecurity Insights
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-[var(--tx-0)] mb-4">
            The <span className="text-gradient">MuchaTech</span> Blog
          </h1>
          <p className="text-[var(--tx-1)] text-lg max-w-xl mx-auto">
            Practical cybersecurity guidance, research and news — written for
            South African businesses.
          </p>
        </div>

        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--tx-2)]"
              strokeWidth={1.5}
            />
            <input
              type="text"
              placeholder="Search posts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-1)] border border-[var(--border)] rounded-xl font-mono text-sm text-[var(--tx-0)] placeholder-[var(--tx-3)] focus:border-[#2BE9F0]/40 focus:ring-2 focus:ring-[#2BE9F0]/08 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-3 py-2 font-mono text-xs rounded-lg border transition-all ${
                !activeTag
                  ? "bg-brand-grad text-white border-[#2BE9F0]"
                  : "bg-[var(--bg-1)] text-[var(--tx-2)] border-[var(--border)] hover:border-[#2BE9F0]/30 hover:text-[#2BE9F0]"
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-3 py-2 font-mono text-xs rounded-lg border transition-all ${
                  activeTag === tag
                    ? "bg-brand-grad text-white border-[#2BE9F0]"
                    : "bg-[var(--bg-1)] text-[var(--tx-2)] border-[var(--border)] hover:border-[#2BE9F0]/30 hover:text-[#2BE9F0]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <Skeleton />
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen className="w-14 h-14 mx-auto mb-4 text-[#E1E8F4]" />
            <h3 className="font-display text-xl font-semibold text-[var(--tx-0)] mb-2">
              No posts found
            </h3>
            <p className="text-[var(--tx-2)] font-mono text-sm mb-6">
              {search
                ? `No results for "${search}"`
                : "No published posts yet."}
            </p>
            <Link
              href="/admin/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-grad text-white font-mono text-sm rounded-xl hover:opacity-90 transition-colors"
            >
              <PenLine className="w-4 h-4" /> Write the first post
            </Link>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && !search && !activeTag && (
              <Link
                href={`/blog/${featured.id}`}
                className="group block bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl overflow-hidden  card-hover mb-10"
              >
                <div
                  className="h-2"
                  style={{
                    background: `linear-gradient(90deg, ${featured.accent}, ${featured.accent === "#0094CC" ? "#00A86B" : "#0094CC"})`,
                  }}
                />
                <div className="p-8 md:p-10 grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className="font-mono text-xs tracking-widest uppercase px-2.5 py-1 rounded-full border"
                        style={{
                          color: featured.accent,
                          borderColor: `${featured.accent}30`,
                          backgroundColor: `${featured.accent}0D`,
                        }}
                      >
                        {featured.tag}
                      </span>
                      <span className="font-mono text-xs text-[var(--tx-2)] px-2.5 py-1 bg-[var(--bg-1)] rounded-full border border-[var(--border)]">
                        Featured
                      </span>
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--tx-0)] leading-snug mb-4 group-hover:text-[#2BE9F0] transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-[var(--tx-1)] leading-relaxed mb-6">
                      {featured.excerpt}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--tx-2)]">
                        <User className="w-3.5 h-3.5" /> {featured.author}
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--tx-2)]">
                        <Clock className="w-3.5 h-3.5" /> {featured.readTime}{" "}
                        min read
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div
                      className="w-full max-w-xs aspect-square rounded-2xl flex items-center justify-center text-6xl font-display font-bold border-2"
                      style={{
                        background: `linear-gradient(135deg, ${featured.accent}12, ${featured.accent}05)`,
                        borderColor: `${featured.accent}20`,
                        color: featured.accent,
                      }}
                    >
                      {featured.title.charAt(0)}
                    </div>
                  </div>
                </div>
                <div
                  className="px-10 pb-8 flex items-center gap-2 font-mono text-sm font-semibold"
                  style={{ color: featured.accent }}
                >
                  Read full article{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )}

            {/* Post grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(search || activeTag ? filtered : rest).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="group bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl overflow-hidden  card-hover flex flex-col"
                >
                  <div
                    className="h-1.5"
                    style={{
                      background: `linear-gradient(90deg, ${post.accent}, transparent)`,
                    }}
                  />
                  <div className="p-7 flex flex-col flex-1">
                    <span
                      className="font-mono text-xs tracking-widest uppercase mb-3 block"
                      style={{ color: post.accent }}
                    >
                      {post.tag}
                    </span>
                    <h3 className="font-display text-lg font-bold text-[var(--tx-0)] mb-3 group-hover:text-[#2BE9F0] transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-[var(--tx-1)] text-sm leading-relaxed flex-1 mb-5">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 font-mono text-xs text-[var(--tx-2)]">
                          <User className="w-3 h-3" /> {post.author}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-xs text-[var(--tx-2)]">
                          <Clock className="w-3 h-3" /> {post.readTime}m
                        </span>
                      </div>
                      <span
                        className="flex items-center gap-1 font-mono text-xs"
                        style={{ color: post.accent }}
                      >
                        Read{" "}
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer strip */}
      <FooterMini />
    </div>
  );
}
