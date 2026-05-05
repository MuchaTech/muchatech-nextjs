"use client";
import { useState, useEffect, useCallback } from "react";
import {
  PenLine,
  Eye,
  Trash2,
  Plus,
  ArrowLeft,
  Save,
  Sparkles,
  CheckCircle,
  Clock,
  User,
  Tag,
  BookOpen,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Loader2,
  X,
  LogOut,
} from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/theme";
import type { BlogPost } from "@/app/data/posts";
import { defaultPosts } from "@/app/data/posts";

/* ─── Storage ──────────────────────────────────────────────────── */
const STORAGE_KEY = "muchatech_blog_posts";

function loadPosts(): BlogPost[] {
  if (typeof window === "undefined") return defaultPosts;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultPosts;
  } catch {
    return defaultPosts;
  }
}
function savePosts(posts: BlogPost[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {}
}

/* ─── Blank post ───────────────────────────────────────────────── */
const blankPost = (): BlogPost => ({
  id: `post-${Date.now()}`,
  title: "",
  tag: "",
  excerpt: "",
  content: "",
  date: new Date().toISOString().split("T")[0],
  author: "MuchaTech Team",
  readTime: 3,
  published: false,
  accent: "#2BE9F0",
});

/* ─── Markdown preview ─────────────────────────────────────────── */
function mdToHtml(md: string): string {
  return md
    .replace(
      /^## (.+)$/gm,
      '<h2 class="text-xl font-bold text-[var(--tx-0)] mt-6 mb-2">$1</h2>',
    )
    .replace(
      /^### (.+)$/gm,
      '<h3 class="text-lg font-semibold text-[var(--tx-0)] mt-4 mb-2">$1</h3>',
    )
    .replace(
      /\*\*(.+?)\*\*/g,
      '<strong class="font-semibold text-[var(--tx-0)]">$1</strong>',
    )
    .replace(
      /`(.+?)`/g,
      '<code class="bg-[#2BE9F0]/10 text-[#2BE9F0] px-1.5 py-0.5 rounded font-mono text-sm">$1</code>',
    )
    .replace(
      /^- (.+)$/gm,
      '<li class="ml-4 list-disc text-[var(--tx-1)] mb-1">$1</li>',
    )
    .replace(
      /\n\n/g,
      '</p><p class="text-[var(--tx-1)] mb-3 leading-relaxed">',
    );
}

type View = "list" | "edit" | "preview";

const inputCls =
  "w-full bg-[var(--bg-0)] border border-[var(--border)] rounded-xl px-3 py-2.5 font-mono text-sm text-[var(--tx-0)] placeholder-[var(--tx-3)] outline-none focus:border-[#2BE9F0]/40 transition-colors";

/* ══════════════════════════════════════════════════════════════════
   ROOT COMPONENT

   ROOT CAUSE OF BROKEN INPUTS (now fixed):
   Previously, ListView / EditorView / PreviewView were defined as
   arrow-function components *inside* BlogAdmin. On every state
   change (every keystroke), React re-created those function
   references, treated them as brand-new component types, and
   unmounted + remounted the entire subtree — resetting focus.

   FIX: Render all three views as plain inline JSX directly in the
   return statement. React reconciles the existing DOM nodes in
   place and inputs keep focus naturally.
══════════════════════════════════════════════════════════════════ */
export default function BlogAdmin() {
  const { isDark } = useTheme();
  const router =
    typeof window !== "undefined"
      ? {
          push: (p: string) => {
            window.location.href = p;
          },
        }
      : null;

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [view, setView] = useState<View>("list");
  const [active, setActive] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiField, setAiField] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  useEffect(() => {
    setPosts(loadPosts());
  }, []);

  /* ── Helpers ───────────────────────────────────────────────────── */
  const notify = useCallback((type: "success" | "error", msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const savePost = useCallback(() => {
    if (!active) return;
    setSaving(true);
    const updated = posts.some((p) => p.id === active.id)
      ? posts.map((p) => (p.id === active.id ? active : p))
      : [...posts, active];
    setPosts(updated);
    savePosts(updated);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 400);
    notify("success", "Post saved!");
  }, [active, posts, notify]);

  const deletePost = useCallback(
    (id: string) => {
      const updated = posts.filter((p) => p.id !== id);
      setPosts(updated);
      savePosts(updated);
      if (active?.id === id) {
        setView("list");
        setActive(null);
      }
      notify("success", "Post deleted.");
    },
    [posts, active, notify],
  );

  const openEdit = useCallback((post: BlogPost) => {
    setActive({ ...post });
    setView("edit");
    setSaved(false);
  }, []);

  const togglePublish = useCallback(
    (id: string) => {
      const updated = posts.map((p) =>
        p.id === id ? { ...p, published: !p.published } : p,
      );
      setPosts(updated);
      savePosts(updated);
      if (active?.id === id)
        setActive((a) => (a ? { ...a, published: !a.published } : null));
    },
    [posts, active],
  );

  // Stable updater — avoids recreating handlers on every render
  const updateField = useCallback(
    <K extends keyof BlogPost>(key: K, value: BlogPost[K]) => {
      setActive((a) => (a ? { ...a, [key]: value } : null));
    },
    [],
  );

  /* ── AI assist ─────────────────────────────────────────────────── */
  const aiAssist = useCallback(
    async (task: "excerpt" | "content" | "title" | "improve") => {
      if (!active) return;
      setAiLoading(true);
      setAiField(task);

      const prompts: Record<typeof task, string> = {
        title: `You are a cybersecurity content writer for MuchaTech, a South African cybersecurity firm. Generate a compelling, SEO-friendly blog post title based on this topic/tag: "${active.tag || active.title}". Return ONLY the title text, nothing else. No quotes, no markdown.`,
        excerpt: `You are a cybersecurity content writer for MuchaTech, a South African cybersecurity firm. Write a compelling 2-sentence excerpt (max 180 chars) for a blog post titled: "${active.title}". Tag/category: ${active.tag}. Return ONLY the excerpt text.`,
        content: `You are a cybersecurity content writer for MuchaTech, a South African cybersecurity firm. Write a full, professional blog post in markdown for the title: "${active.title}". Tag/category: ${active.tag}. Structure: ## Introduction, ## Key Points (with sub-sections), ## Why It Matters for SA Businesses, ## Conclusion. Use **bold** for emphasis, \`code\` for technical terms, and - for bullet lists. Keep it practical, authoritative, and relevant to POPIA and South African context. ~400-600 words.`,
        improve: `You are a cybersecurity content writer for MuchaTech. Improve and professionally rewrite this blog post content while keeping its core message:\n${active.content}\nReturn ONLY the improved markdown content.`,
      };

      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{ role: "user", content: prompts[task] }],
          }),
        });
        const data = await res.json();
        const text =
          data.content?.find((b: { type: string }) => b.type === "text")
            ?.text || "";
        if (!text) throw new Error("No content");

        setActive((prev) => {
          if (!prev) return prev;
          const field =
            task === "title"
              ? "title"
              : task === "excerpt"
                ? "excerpt"
                : "content";
          const readTime =
            task === "content" || task === "improve"
              ? Math.max(1, Math.ceil(text.split(" ").length / 200))
              : prev.readTime;
          return { ...prev, [field]: text.trim(), readTime };
        });
        notify("success", `AI ${task} generated!`);
      } catch {
        notify("error", "AI generation failed. Check your API connection.");
      } finally {
        setAiLoading(false);
        setAiField(null);
      }
    },
    [active, notify],
  );

  /* ══════════════════════════════════════════════════════════════
     RENDER — all views are inline JSX, never sub-components
  ══════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[var(--bg-0)]">
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="bg-[var(--bg-0)]/95 border-b border-[var(--border)] sticky top-0 z-40 nav-blur">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/">
              <Logo height={34} variant={isDark ? "dark" : "light"} />
            </a>
            <span className="text-[var(--border)]">/</span>
            <span className="font-mono text-sm text-[var(--tx-2)]">
              Blog Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/"
              className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-[var(--tx-2)] hover:text-[#2BE9F0] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to site
            </a>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs rounded-lg border transition-all"
              style={{ color: "var(--tx-2)", borderColor: "var(--border)" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "#FC21D1";
                el.style.borderColor = "rgba(252,33,209,0.35)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "var(--tx-2)";
                el.style.borderColor = "var(--border)";
              }}
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      {/* ── Toast ───────────────────────────────────────────────── */}
      {notification && (
        <div
          className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border font-mono text-sm
          ${
            notification.type === "success"
              ? "bg-[var(--bg-1)] border-[#2BE9F0]/30 text-[#2BE9F0]"
              : "bg-[var(--bg-1)] border-[#FC21D1]/40 text-[#FC21D1]"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          {notification.msg}
          <button
            onClick={() => setNotification(null)}
            className="ml-1 opacity-50 hover:opacity-100 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* ════════════════════════════════════════════════════════
            LIST VIEW
        ════════════════════════════════════════════════════════ */}
        {view === "list" && (
          <div>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="font-display text-3xl font-bold text-[var(--tx-0)]">
                  Blog Posts
                </h1>
                <p className="text-[var(--tx-2)] font-mono text-sm mt-1">
                  {posts.length} total ·{" "}
                  {posts.filter((p) => p.published).length} published
                </p>
              </div>
              <button
                onClick={() => openEdit(blankPost())}
                className="flex items-center gap-2 px-5 py-2.5 text-[var(--bg-0)] bg-brand-grad rounded-xl font-display font-bold text-sm hover:opacity-90 transition-opacity glow-cyan"
              >
                <Plus className="w-4 h-4" /> New Post
              </button>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-24 border border-[var(--border)] rounded-2xl text-[var(--tx-2)]">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-mono text-sm">
                  No posts yet. Create your first one!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="group bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl p-5 flex items-center gap-5 hover:border-[#2BE9F0]/25 transition-all"
                  >
                    <div
                      className="w-1 h-12 rounded-full flex-shrink-0"
                      style={{
                        background: `linear-gradient(180deg, ${post.accent}, transparent)`,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="font-mono text-xs tracking-widest uppercase"
                          style={{ color: post.accent }}
                        >
                          {post.tag || "No tag"}
                        </span>
                        <span className="text-[var(--border)]">·</span>
                        <span className="font-mono text-xs text-[var(--tx-3)]">
                          {post.date}
                        </span>
                        <span className="text-[var(--border)]">·</span>
                        <span className="font-mono text-xs text-[var(--tx-3)]">
                          {post.readTime}m
                        </span>
                      </div>
                      <h3 className="font-display font-semibold text-[var(--tx-0)] truncate">
                        {post.title || "Untitled post"}
                      </h3>
                      <p className="text-sm text-[var(--tx-3)] truncate mt-0.5">
                        {post.excerpt || "No excerpt yet…"}
                      </p>
                    </div>
                    <button
                      onClick={() => togglePublish(post.id)}
                      className="flex-shrink-0 flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-full border transition-all"
                      style={
                        post.published
                          ? {
                              borderColor: "#2BE9F040",
                              color: "#2BE9F0",
                              backgroundColor: "#2BE9F00D",
                            }
                          : {
                              borderColor: "var(--border)",
                              color: "var(--tx-2)",
                              backgroundColor: "var(--bg-1)",
                            }
                      }
                    >
                      {post.published ? (
                        <ToggleRight className="w-3.5 h-3.5" />
                      ) : (
                        <ToggleLeft className="w-3.5 h-3.5" />
                      )}
                      {post.published ? "Published" : "Draft"}
                    </button>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setActive({ ...post });
                          setView("preview");
                        }}
                        className="p-2 rounded-lg text-[var(--tx-2)] hover:text-[#2BE9F0] hover:bg-[#2BE9F0]/08 transition-all"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEdit(post)}
                        className="p-2 rounded-lg text-[var(--tx-2)] hover:text-[var(--tx-0)] hover:bg-[var(--border)] transition-all"
                        title="Edit"
                      >
                        <PenLine className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this post?")) deletePost(post.id);
                        }}
                        className="p-2 rounded-lg text-[var(--tx-2)] hover:text-[#FC21D1] hover:bg-[#FC21D1]/08 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            EDITOR VIEW — inputs stay focused because this is
            inline JSX, not a remounted component.
        ════════════════════════════════════════════════════════ */}
        {view === "edit" && active && (
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <button
                onClick={() => setView("list")}
                className="flex items-center gap-2 text-[var(--tx-2)] hover:text-[var(--tx-0)] transition-colors font-mono text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> All posts
              </button>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => updateField("published", !active.published)}
                  className="flex items-center gap-1.5 px-3 py-2 font-mono text-xs rounded-xl border transition-all"
                  style={
                    active.published
                      ? {
                          borderColor: "#2BE9F040",
                          color: "#2BE9F0",
                          backgroundColor: "#2BE9F00D",
                        }
                      : {
                          borderColor: "var(--border)",
                          color: "var(--tx-2)",
                          backgroundColor: "var(--bg-1)",
                        }
                  }
                >
                  {active.published ? (
                    <ToggleRight className="w-4 h-4" />
                  ) : (
                    <ToggleLeft className="w-4 h-4" />
                  )}
                  {active.published ? "Published" : "Draft"}
                </button>
                <button
                  onClick={() => setView("preview")}
                  className="flex items-center gap-1.5 px-3 py-2 font-mono text-xs text-[var(--tx-1)] border border-[var(--border)] rounded-xl hover:border-[#2BE9F0]/30 hover:text-[#2BE9F0] transition-all"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <button
                  onClick={savePost}
                  className="flex items-center gap-1.5 px-4 py-2 text-[var(--bg-0)] bg-brand-grad rounded-xl font-mono text-sm font-semibold hover:opacity-90 transition-opacity glow-cyan"
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : saved ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  {saving ? "Saving…" : saved ? "Saved!" : "Save"}
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main editor */}
              <div className="lg:col-span-2 space-y-5">
                {/* Title */}
                <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-mono text-xs text-[var(--tx-3)] uppercase tracking-widest">
                      Title
                    </label>
                    <button
                      onClick={() => aiAssist("title")}
                      disabled={aiLoading}
                      className="flex items-center gap-1 px-2.5 py-1 font-mono text-xs bg-[var(--bg-0)] border border-[#2BE9F0]/20 text-[#2BE9F0] rounded-lg hover:bg-[#2BE9F0]/08 disabled:opacity-40 transition-all"
                    >
                      {aiLoading && aiField === "title" ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      AI title
                    </button>
                  </div>
                  <input
                    value={active.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="Enter post title…"
                    className="w-full font-display text-2xl font-bold text-[var(--tx-0)] bg-transparent border-none outline-none placeholder-[var(--tx-3)]"
                  />
                </div>

                {/* Excerpt */}
                <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-mono text-xs text-[var(--tx-3)] uppercase tracking-widest">
                      Excerpt / Summary
                    </label>
                    <button
                      onClick={() => aiAssist("excerpt")}
                      disabled={aiLoading || !active.title}
                      className="flex items-center gap-1 px-2.5 py-1 font-mono text-xs bg-[var(--bg-0)] border border-[#2BE9F0]/20 text-[#2BE9F0] rounded-lg hover:bg-[#2BE9F0]/08 disabled:opacity-40 transition-all"
                    >
                      {aiLoading && aiField === "excerpt" ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      AI excerpt
                    </button>
                  </div>
                  <textarea
                    value={active.excerpt}
                    onChange={(e) => updateField("excerpt", e.target.value)}
                    placeholder="A short description shown in the blog listing…"
                    rows={3}
                    className="w-full bg-transparent text-[var(--tx-1)] text-sm leading-relaxed resize-none outline-none placeholder-[var(--tx-3)]"
                  />
                </div>

                {/* Content */}
                <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <label className="font-mono text-xs text-[var(--tx-3)] uppercase tracking-widest">
                      Content (Markdown)
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => aiAssist("content")}
                        disabled={aiLoading || !active.title}
                        className="flex items-center gap-1 px-2.5 py-1 font-mono text-xs bg-[var(--bg-0)] border border-[#2BE9F0]/20 text-[#2BE9F0] rounded-lg hover:bg-[#2BE9F0]/08 disabled:opacity-40 transition-all"
                      >
                        {aiLoading && aiField === "content" ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        AI draft
                      </button>
                      <button
                        onClick={() => aiAssist("improve")}
                        disabled={aiLoading || !active.content}
                        className="flex items-center gap-1 px-2.5 py-1 font-mono text-xs bg-[var(--bg-0)] border border-[#FC21D1]/20 text-[#FC21D1] rounded-lg hover:bg-[#FC21D1]/08 disabled:opacity-40 transition-all"
                      >
                        {aiLoading && aiField === "improve" ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        AI improve
                      </button>
                    </div>
                  </div>
                  {aiLoading &&
                  (aiField === "content" || aiField === "improve") ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-[#2BE9F0]" />
                      <span className="font-mono text-sm text-[var(--tx-2)]">
                        Claude is writing your post…
                      </span>
                    </div>
                  ) : (
                    <textarea
                      value={active.content}
                      onChange={(e) => {
                        const text = e.target.value;
                        setActive((a) =>
                          a
                            ? {
                                ...a,
                                content: text,
                                readTime: Math.max(
                                  1,
                                  Math.ceil(text.split(" ").length / 200),
                                ),
                              }
                            : null,
                        );
                      }}
                      placeholder={`## Introduction\n\nStart writing in Markdown…\n\n## Key Points\n\n- Point one\n- Point two`}
                      rows={24}
                      className="w-full bg-[var(--bg-0)] border border-[var(--border)] rounded-xl px-4 py-3 font-mono text-sm text-[var(--tx-0)] placeholder-[var(--tx-3)] resize-y outline-none leading-relaxed focus:border-[#2BE9F0]/30 transition-colors"
                    />
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-5">
                {/* Post details */}
                <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-2xl p-5 space-y-4">
                  <h3 className="font-display font-semibold text-[var(--tx-0)] text-sm">
                    Post Details
                  </h3>

                  <div>
                    <label className="flex items-center gap-1.5 font-mono text-xs text-[var(--tx-3)] uppercase tracking-widest mb-1.5">
                      <Tag className="w-3 h-3" /> Tag / Category
                    </label>
                    <input
                      value={active.tag}
                      onChange={(e) => updateField("tag", e.target.value)}
                      placeholder="e.g. Zero Trust Architecture"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 font-mono text-xs text-[var(--tx-3)] uppercase tracking-widest mb-1.5">
                      <User className="w-3 h-3" /> Author
                    </label>
                    <input
                      value={active.author}
                      onChange={(e) => updateField("author", e.target.value)}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 font-mono text-xs text-[var(--tx-3)] uppercase tracking-widest mb-1.5">
                      <Clock className="w-3 h-3" /> Date
                    </label>
                    <input
                      type="date"
                      value={active.date}
                      onChange={(e) => updateField("date", e.target.value)}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs text-[var(--tx-3)] uppercase tracking-widest block mb-2">
                      Accent Colour
                    </label>
                    <div className="flex gap-2">
                      {[
                        { col: "#2BE9F0", label: "Cyan" },
                        { col: "#FC21D1", label: "Magenta" },
                      ].map(({ col, label }) => (
                        <button
                          key={col}
                          onClick={() => updateField("accent", col)}
                          className="flex-1 py-2 rounded-xl border-2 font-mono text-xs font-semibold transition-all"
                          style={{
                            backgroundColor: `${col}14`,
                            color: col,
                            borderColor:
                              active.accent === col ? col : "transparent",
                            opacity: active.accent === col ? 1 : 0.45,
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--border)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-[var(--tx-3)]">
                        Est. read time
                      </span>
                      <span className="font-mono text-sm font-semibold text-[#2BE9F0]">
                        {active.readTime} min
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-[var(--tx-3)]">
                        Word count
                      </span>
                      <span className="font-mono text-sm text-[var(--tx-1)]">
                        {active.content.split(/\s+/).filter(Boolean).length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI assistant */}
                <div
                  className="rounded-2xl p-5 border border-[#2BE9F0]/15"
                  style={{
                    background:
                      "linear-gradient(135deg,rgba(43,233,240,0.04),rgba(252,33,209,0.03))",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-[#2BE9F0]" />
                    <span className="font-display font-semibold text-[var(--tx-0)] text-sm">
                      AI Writing Assistant
                    </span>
                  </div>
                  <p className="text-[var(--tx-2)] text-xs leading-relaxed mb-4">
                    Claude can help draft cybersecurity content tailored for the
                    South African market.
                  </p>
                  <div className="space-y-2">
                    {[
                      {
                        task: "title" as const,
                        label: "Generate title from tag",
                        col: "#2BE9F0",
                        disabled: false,
                      },
                      {
                        task: "excerpt" as const,
                        label: "Write excerpt from title",
                        col: "#2BE9F0",
                        disabled: !active.title,
                      },
                      {
                        task: "content" as const,
                        label: "Draft full post with AI",
                        col: "#2BE9F0",
                        disabled: !active.title,
                      },
                      {
                        task: "improve" as const,
                        label: "Improve existing content",
                        col: "#FC21D1",
                        disabled: !active.content,
                      },
                    ].map(({ task, label, col, disabled }) => (
                      <button
                        key={task}
                        onClick={() => aiAssist(task)}
                        disabled={aiLoading || disabled}
                        className="w-full flex items-center gap-2 px-3 py-2.5 bg-[var(--bg-0)] border border-[var(--border)] rounded-xl font-mono text-xs text-[var(--tx-1)] hover:border-[#2BE9F0]/25 disabled:opacity-40 transition-all"
                      >
                        {aiLoading && aiField === task ? (
                          <Loader2
                            className="w-3.5 h-3.5 animate-spin flex-shrink-0"
                            style={{ color: col }}
                          />
                        ) : (
                          <Sparkles
                            className="w-3.5 h-3.5 flex-shrink-0"
                            style={{ color: col }}
                          />
                        )}
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Danger zone */}
                <div className="bg-[var(--bg-1)] border border-[#FC21D1]/20 rounded-2xl p-5">
                  <h4 className="font-mono text-xs text-[#FC21D1] uppercase tracking-widest mb-3">
                    Danger Zone
                  </h4>
                  <button
                    onClick={() => {
                      if (confirm("Delete this post? This cannot be undone.")) {
                        deletePost(active.id);
                        setView("list");
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#FC21D1]/30 text-[#FC21D1] font-mono text-xs rounded-xl hover:bg-[#FC21D1]/08 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete this post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            PREVIEW VIEW
        ════════════════════════════════════════════════════════ */}
        {view === "preview" && active && (
          <div>
            <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
              <button
                onClick={() => setView("edit")}
                className="flex items-center gap-2 text-[var(--tx-2)] hover:text-[var(--tx-0)] transition-colors font-mono text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Back to editor
              </button>
              <span
                className="font-mono text-xs px-3 py-1.5 rounded-full border"
                style={
                  active.published
                    ? {
                        backgroundColor: "#2BE9F00D",
                        color: "#2BE9F0",
                        borderColor: "#2BE9F040",
                      }
                    : {
                        backgroundColor: "var(--bg-1)",
                        color: "var(--tx-2)",
                        borderColor: "var(--border)",
                      }
                }
              >
                {active.published ? "Published" : "Draft"}
              </span>
            </div>

            <div className="max-w-3xl mx-auto">
              <div
                className="h-1.5 rounded-t-xl mb-8"
                style={{
                  background: `linear-gradient(90deg, ${active.accent}, transparent)`,
                }}
              />
              <span
                className="font-mono text-xs uppercase tracking-widest mb-4 block"
                style={{ color: active.accent }}
              >
                {active.tag}
              </span>
              <h1 className="font-display text-4xl font-bold text-[var(--tx-0)] mb-4 leading-snug">
                {active.title || "Untitled"}
              </h1>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[var(--border)]">
                <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--tx-2)]">
                  <User className="w-3.5 h-3.5" /> {active.author}
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--tx-2)]">
                  <Clock className="w-3.5 h-3.5" /> {active.readTime} min read
                </div>
                <span className="font-mono text-xs text-[var(--tx-2)]">
                  {active.date}
                </span>
              </div>
              {active.excerpt && (
                <p
                  className="text-[var(--tx-1)] text-lg leading-relaxed mb-8 italic border-l-4 pl-4"
                  style={{ borderColor: active.accent }}
                >
                  {active.excerpt}
                </p>
              )}
              <div
                className="prose-content"
                dangerouslySetInnerHTML={{
                  __html: `<p class="text-[var(--tx-1)] mb-3 leading-relaxed">${mdToHtml(active.content)}</p>`,
                }}
              />
              {!active.content && (
                <p className="text-[var(--tx-2)] font-mono text-sm italic">
                  No content yet — go back to write your post.
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
