import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  // Honeypot: real users never fill the hidden "website" field
  if (body?.website) return NextResponse.json({ ok: true });

  const name = str(body?.name, 120);
  const email = str(body?.email, 200);
  const message = str(body?.message, 5000);
  if (!name || !EMAIL.test(email) || message.length < 2) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const { error } = await createAdminClient().from("contact_messages").insert({
    name,
    email,
    phone: str(body?.phone, 40) || null,
    subject: str(body?.subject, 200) || null,
    message,
    locale: str(body?.locale, 5) || null,
  });
  if (error) return NextResponse.json({ error: "failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
