"use client";
import { ArrowRight, Clock, User, PenLine } from "lucide-react";
import Link from "next/link";
import { usePosts } from "@/lib/usePosts";

export default function Blog() {
  const { posts, loading } = usePosts();
  const published = posts.filter((p) => p.published).slice(0, 3);

  return (
    <section id="blog" className="py-16 md:py-28 bg-[var(--bg-1)] relative">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="section-label">
          <span>// 007 · latest posts</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--tx-0)]">
            Latest <span className="text-brand">Insights</span>
          </h2>
          <div className="flex gap-3 items-center">
            {/*<Link
              href="/admin/blog"
              className="inline-flex items-center gap-1.5 px-4 py-2 font-mono text-sm text-[var(--bg-0)] bg-brand-grad rounded-xl hover:opacity-90 transition-opacity"
            >
              <PenLine className="w-3.5 h-3.5" /> New Post
            </Link>*/}
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 font-mono text-sm text-[var(--tx-2)] hover:text-[#2BE9F0] transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[var(--bg-0)] border border-[var(--border)] rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-1 bg-[var(--border)]" />
                <div className="p-7 space-y-3">
                  <div className="h-3 w-28 bg-[var(--border)] rounded" />
                  <div className="h-5 w-full bg-[var(--border)] rounded" />
                  <div className="h-4 w-5/6 bg-[var(--bg-2)] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : published.length === 0 ? (
          <div className="text-center py-20 bg-[var(--bg-0)] border border-[var(--border)] rounded-2xl">
            <PenLine className="w-10 h-10 mx-auto mb-4 text-[var(--border)]" />
            <p className="font-display text-lg font-semibold text-[var(--tx-0)] mb-2">
              No posts published yet
            </p>
            {/*<Link
              href="/admin/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 mt-4 text-[var(--bg-0)] bg-brand-grad font-mono text-sm rounded-xl"
            >
              <PenLine className="w-4 h-4" /> Write a post
            </Link>*/}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {published.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="card-hover group bg-[var(--bg-0)] border border-[var(--border)] rounded-2xl overflow-hidden flex flex-col"
              >
                <div
                  className="h-1"
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
                  <p className="text-[var(--tx-2)] text-sm leading-relaxed flex-1 mb-5">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-mono text-xs text-[var(--tx-3)]">
                        <User className="w-3 h-3" /> {post.author}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-xs text-[var(--tx-3)]">
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
        )}
      </div>
    </section>
  );
}
