// src/app/week/[num]/page.tsx
"use client";

import { use, useEffect, useMemo, useState } from "react";
import { captureMagicFromUrl, getMagicToken } from "@/lib/magic";
import Link from "next/link";

type Comment = {
  id: string;
  week: number;
  name: string | null;
  text: string;
  created_at: string;
};

const WEEK_INFO: Record<number, { label: string; pages: string }> = {
  1: { label: "Week 1", pages: "pp. 1–36" },
  2: { label: "Week 2", pages: "pp. 37–72" },
  3: { label: "Week 3", pages: "pp. 73–108" },
  4: { label: "Week 4", pages: "pp. 109–144" },
  5: { label: "Week 5", pages: "pp. 145–171" },
};

export default function WeekPage({ params }: { params: Promise<{ num: string }> | { num: string } }) {
  // Use React's use() hook to unwrap Promise if needed (Next.js 16)
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const weekNum = useMemo(() => Number(resolvedParams.num), [resolvedParams.num]);
  const weekInfo = WEEK_INFO[weekNum];

  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    captureMagicFromUrl();
  }, []);

  async function load() {
    setStatus(null);
    const res = await fetch(`/api/comments?week=${weekNum}`);
    const data = await res.json();
    setComments(data.comments ?? []);
  }

  useEffect(() => {
    if (Number.isFinite(weekNum) && weekNum >= 1 && weekNum <= 5) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekNum]);

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
        week: weekNum,
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

  if (!Number.isInteger(weekNum) || weekNum < 1 || weekNum > 5 || !weekInfo) {
    return (
      <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
        <p>Invalid week. Please select a week from 1 to 5.</p>
        <Link href="/" style={{ color: "inherit", textDecoration: "underline" }}>
          ← Back to home
        </Link>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <div style={{ marginBottom: 8 }}>
        <Link href="/" style={{ color: "inherit", textDecoration: "none", fontSize: 14, opacity: 0.8 }}>
          ← Back to weeks
        </Link>
      </div>
      <h1 style={{ marginTop: 16, marginBottom: 4 }}>{weekInfo.label}</h1>
      <p style={{ fontSize: 16, opacity: 0.7, marginBottom: 24 }}>{weekInfo.pages}</p>

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