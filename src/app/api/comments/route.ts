import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

console.log("ENV CHECK", {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  HAS_SERVICE: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
});

const MAGIC = process.env.MAGIC_TOKEN!;

// --- super-light rate limit (per instance, per IP) ---
type Bucket = { tokens: number; last: number };
const buckets = new Map<string, Bucket>();
const MAX_TOKENS = 10;
const REFILL_MS = 60_000;

function allowPost(ip: string) {
  const now = Date.now();
  const b = buckets.get(ip) ?? { tokens: MAX_TOKENS, last: now };
  const elapsed = now - b.last;

  const refill = (elapsed / REFILL_MS) * MAX_TOKENS;
  b.tokens = Math.min(MAX_TOKENS, b.tokens + refill);
  b.last = now;

  if (b.tokens < 1) {
    buckets.set(ip, b);
    return false;
  }

  b.tokens -= 1;
  buckets.set(ip, b);
  return true;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const weekStr = searchParams.get("week");
  const week = Number(weekStr);

  if (!Number.isInteger(week) || week < 1 || week > 5) {
    return NextResponse.json(
      { error: "Invalid week. Must be between 1 and 5." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("comments")
    .select("id, week, name, text, created_at")
    .eq("week", week)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comments: data ?? [] });
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!allowPost(ip)) {
    return NextResponse.json(
      { error: "Rate limited. Try again in a minute." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { week, name, text, magic } = body as {
    week: number;
    name?: string;
    text: string;
    magic: string;
  };

  if (magic !== MAGIC) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!Number.isInteger(week) || week < 1 || week > 5) {
    return NextResponse.json(
      { error: "Invalid week. Must be between 1 and 5." },
      { status: 400 }
    );
  }

  if (typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json({ error: "Comment required" }, { status: 400 });
  }

  if (text.length > 2000) {
    return NextResponse.json({ error: "Comment too long" }, { status: 400 });
  }

  const cleanName =
    typeof name === "string" && name.trim().length > 0
      ? name.trim().slice(0, 60)
      : null;

  const { data, error } = await supabaseAdmin
    .from("comments")
    .insert([{ week, name: cleanName, text: text.trim() }])
    .select("id, week, name, text, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comment: data }, { status: 201 });
}