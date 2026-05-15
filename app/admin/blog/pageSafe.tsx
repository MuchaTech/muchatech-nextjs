"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  Calendar,
  X,
  LogOut,
} from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/theme";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { BlogPost } from "@/app/data/posts";
import { defaultPosts } from "@/app/data/posts";

/* ─── Storage with error handling ──────────────────────────────── */
const STORAGE_KEY = "muchatech_blog_posts";

function loadPosts(): BlogPost[] {
  if (typeof window === "undefined") return defaultPosts;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPosts;

    const parsed = JSON.parse(raw);
    // Validate structure
    if (!Array.isArray(parsed)) return defaultPosts;

    return parsed.every(
      (post) =>
        typeof post === "object" && post.id && post.title && post.content,
    )
      ? parsed
      : defaultPosts;
  } catch (error) {
    console.error("Failed to load posts:", error);
    return defaultPosts;
  }
}

function savePosts(posts: BlogPost[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    return true;
  } catch (error) {
    console.error("Failed to save posts:", error);
    return false;
  }
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

/* ─── Markdown components for safe rendering ──────────────────── */
const markdownComponents = {
  code: ({ inline, children }: any) => {
    if (inline) {
      return (
        <code className="bg-[#2BE9F0]/10 text-[#2BE9F0] px-1.5 py-0.5 rounded font-mono text-sm">
          {children}
        </code>
      );
    }
    return (
      <pre className="bg-[var(--bg-1)] border border-[var(--border)] rounded-lg p-3 overflow-x-auto my-3">
        <code className="text-[var(--tx-1)] font-mono text-sm">{children}</code>
      </pre>
    );
  },
  h2: ({ children }: any) => (
    <h2 className="text-xl font-bold text-[var(--tx-0)] mt-6 mb-2">
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-lg font-semibold text-[var(--tx-0)] mt-4 mb-2">
      {children}
    </h3>
  ),
  strong: ({ children }: any) => (
    <strong className="font-semibold text-[var(--tx-0)]">{children}</strong>
  ),
  ul: ({ children }: any) => (
    <ul className="list-disc list-inside ml-4 text-[var(--tx-1)] mb-3 space-y-1">
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-inside ml-4 text-[var(--tx-1)] mb-3 space-y-1">
      {children}
    </ol>
  ),
  li: ({ children }: any) => <li className="text-[var(--tx-1)]">{children}</li>,
  p: ({ children }: any) => (
    <p className="text-[var(--tx-1)] mb-3 leading-relaxed">{children}</p>
  ),
  a: ({ href, children }: any) => (
    <a
      href={href}
      className="text-[#2BE9F0] hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
};

/* ─── Validation ───────────────────────────────────────────────── */
function validatePost(post: BlogPost): string[] {
  const errors: string[] = [];

  if (!post.title?.trim()) errors.push("Title is required");
  if (!post.content?.trim()) errors.push("Content is required");
  if (!post.excerpt?.trim()) errors.push("Excerpt is required");
  if (post.title && post.title.length > 200)
    errors.push("Title must be under 200 characters");
  if (post.excerpt && post.excerpt.length > 500)
    errors.push("Excerpt must be under 500 characters");

  return errors;
}

/* ─── Type definitions ─────────────────────────────────────────── */
type View = "list" | "edit" | "preview";

const inputCls =
  "w-full bg-[var(--bg-0)] border border-[var(--border)] rounded-xl px-3 py-2.5 font-mono text-sm text-[var(--tx-0)] placeholder-[var(--tx-3)] outline-none focus:border-[#2BE9F0]/40 transition-colors";

/* ─── Main Blog Editor Component ───────────────────────────────── */
export default function BlogEditor() {
  const { isDark } = useTheme();
  const [view, setView] = useState<View>("list");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [isLoading, setIsLoading] = useState(true);

  // Load posts on mount
  useEffect(() => {
    setIsLoading(true);
    const loaded = loadPosts();
    setPosts(loaded);
    setIsLoading(false);
  }, []);

  // Handle new post
  const handleNewPost = useCallback(() => {
    setEditingPost(blankPost());
    setValidationErrors([]);
    setView("edit");
  }, []);

  // Handle edit
  const handleEdit = useCallback((post: BlogPost) => {
    setEditingPost(post);
    setValidationErrors([]);
    setView("edit");
  }, []);

  // Handle save with validation
  const handleSave = useCallback(() => {
    if (!editingPost) return;

    const errors = validatePost(editingPost);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setSaveStatus("saving");

    // Simulate async save
    setTimeout(() => {
      const updated = editingPost.id
        ? posts.map((p) => (p.id === editingPost.id ? editingPost : p))
        : [...posts, editingPost];

      const success = savePosts(updated);

      if (success) {
        setPosts(updated);
        setSaveStatus("success");
        setTimeout(() => {
          setView("list");
          setSaveStatus("idle");
          setEditingPost(null);
          setValidationErrors([]);
        }, 1500);
      } else {
        setSaveStatus("error");
        setValidationErrors(["Failed to save. Please try again."]);
      }
    }, 800);
  }, [editingPost, posts]);

  // Handle delete with confirmation
  const handleDelete = useCallback(
    (id: string) => {
      if (confirm("Are you sure you want to delete this post?")) {
        const filtered = posts.filter((p) => p.id !== id);
        const success = savePosts(filtered);
        if (success) {
          setPosts(filtered);
        } else {
          alert("Failed to delete post");
        }
      }
    },
    [posts],
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    setEditingPost(null);
    setValidationErrors([]);
    setView("list");
  }, []);

  // Memoized markdown preview
  const previewContent = useMemo(() => {
    return editingPost?.content || "";
  }, [editingPost?.content]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-0)]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2BE9F0]" />
      </div>
    );
  }

  // ─── List View ─────────────────────────────────────────────────
  if (view === "list") {
    return (
      <div className="min-h-screen bg-[var(--bg-0)]">
        <header className="sticky top-0 bg-[var(--bg-0)] border-b border-[var(--border)] backdrop-blur-sm z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={handleNewPost}
                className="flex items-center gap-2 bg-[#2BE9F0] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#2BE9F0]/90 transition-colors"
                aria-label="Create new post"
              >
                <Plus className="w-4 h-4" />
                New Post
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-[var(--tx-3)] mx-auto mb-4" />
              <p className="text-[var(--tx-1)] mb-4">
                No posts yet. Create one to get started!
              </p>
              <button
                onClick={handleNewPost}
                className="flex items-center gap-2 bg-[#2BE9F0] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#2BE9F0]/90 transition-colors mx-auto"
              >
                <Plus className="w-4 h-4" />
                Create First Post
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-[var(--bg-1)] border border-[var(--border)] rounded-xl p-4 hover:border-[#2BE9F0]/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-[var(--tx-0)]">
                          {post.title}
                        </h3>
                        {post.published && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-[var(--tx-2)] mb-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-[var(--tx-3)]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime} min
                        </span>
                        {post.tag && (
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {post.tag}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-2 hover:bg-[var(--bg-0)] rounded-lg transition-colors"
                        aria-label="Edit post"
                      >
                        <PenLine className="w-4 h-4 text-[#2BE9F0]" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 hover:bg-[var(--bg-0)] rounded-lg transition-colors"
                        aria-label="Delete post"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  // ─── Edit View ─────────────────────────────────────────────────
  // ─── Edit View ─────────────────────────────────────────────────
  if (view === "edit" && editingPost) {
    return (
      <div className="min-h-screen bg-[var(--bg-0)]">
        <header className="sticky top-0 bg-[var(--bg-0)] border-b border-[var(--border)] backdrop-blur-sm z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-[var(--bg-1)] rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-[var(--tx-0)]" />
              </button>
              <h1 className="text-xl font-semibold text-[var(--tx-0)]">
                {editingPost.id && posts.some((p) => p.id === editingPost.id)
                  ? "Edit Post"
                  : "New Post"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setView("preview")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-1)] transition-colors text-[var(--tx-0)]"
                aria-label="Preview post"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={handleSave}
                disabled={saveStatus === "saving"}
                className="flex items-center gap-2 bg-[#2BE9F0] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#2BE9F0]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saveStatus === "saving" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : saveStatus === "success" ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Validation errors */}
          {validationErrors.length > 0 && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-500 mb-2">
                    Please fix the following errors:
                  </h3>
                  <ul className="space-y-1">
                    {validationErrors.map((error, idx) => (
                      <li key={idx} className="text-sm text-red-400">
                        • {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Form grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-[var(--tx-0)] mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, title: e.target.value })
                  }
                  placeholder="Post title..."
                  className={inputCls}
                  maxLength={200}
                />
                <p className="text-xs text-[var(--tx-3)] mt-1">
                  {editingPost.title.length}/200
                </p>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-semibold text-[var(--tx-0)] mb-2">
                  Excerpt
                </label>
                <textarea
                  value={editingPost.excerpt}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, excerpt: e.target.value })
                  }
                  placeholder="Brief summary of your post..."
                  className={`${inputCls} resize-none h-24`}
                  maxLength={500}
                />
                <p className="text-xs text-[var(--tx-3)] mt-1">
                  {editingPost.excerpt.length}/500
                </p>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-[var(--tx-0)] mb-2">
                  Content (Markdown)
                </label>
                <textarea
                  value={editingPost.content}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, content: e.target.value })
                  }
                  placeholder="Write your post in Markdown..."
                  className={`${inputCls} resize-none h-80 font-mono`}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish status */}
              <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold text-[var(--tx-0)]">
                    Status
                  </label>
                  <button
                    onClick={() =>
                      setEditingPost({
                        ...editingPost,
                        published: !editingPost.published,
                      })
                    }
                    className="transition-colors"
                  >
                    {editingPost.published ? (
                      <ToggleRight className="w-5 h-5 text-[#2BE9F0]" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-[var(--tx-3)]" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-[var(--tx-2)]">
                  {editingPost.published ? "Published" : "Draft"}
                </p>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-[var(--tx-0)] mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={editingPost.date}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, date: e.target.value })
                  }
                  className={inputCls}
                />
              </div>

              {/* Tag */}
              <div>
                <label className="block text-sm font-semibold text-[var(--tx-0)] mb-2">
                  Tag
                </label>
                <input
                  type="text"
                  value={editingPost.tag}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, tag: e.target.value })
                  }
                  placeholder="e.g., JavaScript"
                  className={inputCls}
                />
              </div>

              {/* Read time */}
              <div>
                <label className="block text-sm font-semibold text-[var(--tx-0)] mb-2">
                  Read Time (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  value={editingPost.readTime}
                  onChange={(e) =>
                    setEditingPost({
                      ...editingPost,
                      readTime: parseInt(e.target.value) || 1,
                    })
                  }
                  className={inputCls}
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-semibold text-[var(--tx-0)] mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={editingPost.author}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, author: e.target.value })
                  }
                  className={inputCls}
                />
              </div>

              {/* Accent color */}
              <div>
                <label className="block text-sm font-semibold text-[var(--tx-0)] mb-2">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={editingPost.accent}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, accent: e.target.value })
                    }
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <span className="text-xs text-[var(--tx-2)]">
                    {editingPost.accent}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── Preview View ─────────────────────────────────────────────────
  if (view === "preview" && editingPost) {
    return (
      <div className="min-h-screen bg-[var(--bg-0)]">
        <header className="sticky top-0 bg-[var(--bg-0)] border-b border-[var(--border)] backdrop-blur-sm z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setView("edit")}
                className="p-2 hover:bg-[var(--bg-1)] rounded-lg transition-colors"
                aria-label="Back to edit"
              >
                <ArrowLeft className="w-5 h-5 text-[var(--tx-0)]" />
              </button>
              <h1 className="text-xl font-semibold text-[var(--tx-0)]">
                Preview
              </h1>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Preview header */}
          <article className="mb-8">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-[var(--tx-0)] mb-4">
                {editingPost.title || "Untitled"}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--tx-2)]">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {editingPost.author}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {editingPost.readTime} min read
                </span>
                {editingPost.tag && (
                  <span className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {editingPost.tag}
                  </span>
                )}
              </div>
            </div>

            {editingPost.excerpt && (
              <p className="text-lg text-[var(--tx-1)] italic mb-6 pb-6 border-b border-[var(--border)]">
                {editingPost.excerpt}
              </p>
            )}

            {/* Markdown preview */}
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {previewContent}
              </ReactMarkdown>
            </div>
          </article>
        </main>
      </div>
    );
  }

  return null;
}
