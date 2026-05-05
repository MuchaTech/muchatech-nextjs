"use client";
import { useState, useEffect } from "react";
import type { BlogPost } from "@/app/data/posts";
import { defaultPosts } from "@/app/data/posts";

const STORAGE_KEY = "muchatech_blog_posts";

export function usePosts(): { posts: BlogPost[]; loading: boolean } {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setPosts(raw ? JSON.parse(raw) : defaultPosts);
    } catch {
      setPosts(defaultPosts);
    } finally {
      setLoading(false);
    }
  }, []);

  return { posts, loading };
}

export function usePost(slug: string): {
  post: BlogPost | null;
  loading: boolean;
} {
  const { posts, loading } = usePosts();
  const post = posts.find((p) => p.id === slug && p.published) ?? null;
  return { post, loading };
}
