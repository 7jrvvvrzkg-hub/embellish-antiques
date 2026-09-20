import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { createServiceClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const { email, interestCategory } = (await request.json()) as {
    email: string;
    interestCategory?: string;
  };

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, message: "That doesn't look like a valid email." }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    // Demo mode: acknowledge success so the UI reads correctly, but nothing
    // is persisted until a real Supabase project is connected.
    return NextResponse.json({ ok: true, persisted: false });
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("subscribers")
    .upsert(
      { email: email.toLowerCase().trim(), interest_category: interestCategory ?? null, unsubscribed: false },
      { onConflict: "email" }
    );

  if (error) {
    return NextResponse.json({ ok: false, message: "Something went wrong — try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, persisted: true });
}
