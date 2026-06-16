"use client";

import React, { useState, useEffect } from "react";
import ShareRow from "@/app/components/ShareRow";

interface Post {
  slug: string;
  title: string;
  date: string;
  teaser: string;
  htmlContent?: string;
  metaDescription?: string;
  ogImage?: string;
  tldr?: string[];
  faqs?: { q: string; a: string }[];
}

interface BlogModalContentProps {
  initialSlug?: string;
  onClose: () => void;
}

export default function BlogModalContent({ initialSlug, onClose }: BlogModalContentProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentSlug, setCurrentSlug] = useState<string | undefined>(initialSlug);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);

  // Load all posts on mount
  useEffect(() => {
    async function loadPosts() {
      const res = await fetch('/api/blog');
      const allPosts: Post[] = await res.json();
      setPosts(allPosts);
      if (!currentSlug && allPosts.length > 0) {
        setCurrentSlug(allPosts[0].slug);
      }
    }
    loadPosts();
  }, []);

  // Load current post when slug changes
  useEffect(() => {
    if (!currentSlug) {
      setCurrentPost(null);
      return;
    }
    setLoading(true);
    fetch('/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: currentSlug }),
    })
      .then(res => res.json())
      .then((post: Post) => {
        setCurrentPost(post);
        setLoading(false);
      });
  }, [currentSlug]);

  if (loading) {
    return (
      <div className="text-neon-green p-4">
        Loading blog post...
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="text-neon-green p-4">
        No blog post selected.
      </div>
    );
  }

  // ShareRow expects props: urlToShare and titleToShare
  // Adjusting props accordingly

  return (
    <div className="flex flex-col h-full text-neon-green bg-black p-6 overflow-y-auto px-[10vw]">
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-neon-green">{currentPost.title}</h1>
        <p className="text-dark-green">{currentPost.date}</p>
        <ShareRow urlToShare={`/blog/${currentPost.slug}`} titleToShare={currentPost.title} />
      </header>
      <article
        className="prose max-w-none flex-grow overflow-y-auto cursor-pointer"
        style={{ color: '#4F7942' }}
        dangerouslySetInnerHTML={{ __html: currentPost.htmlContent || "" }}
        onClick={onClose}
      />
      {/* Close button removed as per request */}
      <nav className="mt-6 flex flex-wrap gap-2 overflow-x-auto">
        {posts.map((post) => (
          <button
            key={post.slug}
            onClick={() => setCurrentSlug(post.slug)}
            className={`px-3 py-1 rounded whitespace-nowrap ${
              post.slug === currentSlug ? "bg-neon-green text-black" : "bg-dark-green text-neon-green hover:bg-neon-green hover:text-black"
            }`}
          >
            {post.title}
          </button>
        ))}
      </nav>
    </div>
  );
}
