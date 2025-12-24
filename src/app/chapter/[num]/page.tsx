// src/app/chapter/[num]/page.tsx
"use client";

import { use, useEffect, useMemo, useState } from "react";
import { captureMagicFromUrl, getMagicToken } from "@/lib/magic";

type Comment = {
  id: string;
  chapter: number;
  name: string | null;
  text: string;
  created_at: string;
};

export default function ChapterPage({ params }: { params: Promise<{ num: string }> | { num: string } }) {
  // Use React's use() hook to unwrap Promise if needed (Next.js 16)
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const chapter = useMemo(() => Number(resolvedParams.num), [resolvedParams.num]);

  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    captureMagicFromUrl();
  }, []);

  async function load() {
    setStatus(null);
    const res = await fetch(`/api/comments?chapter=${chapter}`);
    const data = await res.json();
    setComments(data.comments ?? []);
  }

  useEffect(() => {
    if (Number.isFinite(chapter) && chapter >= 1) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter]);

  async function submit() {
    const magic = getMagicToken();
    if (!magic) {
      setStatus("No magic link token found. Open the site using your magic link.");
      return;
    }

    setStatus("Posting...");
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chapter,
        name: name.trim() || undefined,
        text,
        magic,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus(data.error ?? "Failed to post.");
      return;
    }

    setText("");
    setStatus(null);
    setComments((prev) => [...prev, data.comment]);
  }

  if (!Number.isInteger(chapter) || chapter < 1) {
    return (
      <main style={{ padding: 24 }}>
        <p>Invalid chapter.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1>Chapter {chapter}</h1>

      <section style={{ marginTop: 24 }}>
        <h2>Comments</h2>

        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          <input
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: 8 }}
          />
          <textarea
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            style={{ padding: 8 }}
          />
          <button onClick={submit} disabled={!text.trim()}>
            Post
          </button>
          {status && <p>{status}</p>}
        </div>

        <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
          {comments.map((c) => (
            <div key={c.id} style={{ border: "1px solid #ddd", padding: 12 }}>
              <div style={{ fontSize: 14, opacity: 0.8 }}>
                {c.name ?? "Anonymous"} •{" "}
                {new Date(c.created_at).toLocaleString()}
              </div>
              <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{c.text}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}