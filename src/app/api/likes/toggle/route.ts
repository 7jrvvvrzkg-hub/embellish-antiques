import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { productId, visitorId, liked } = (await request.json()) as {
    productId: string;
    visitorId: string;
    liked: boolean;
  };

  if (!productId || !visitorId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // In demo mode (no Supabase yet) likes just live in the browser via
  // localStorage — nothing to persist server-side. Once Supabase is
  // configured, the trigger in 0001_init.sql keeps products.like_count in
  // sync automatically whenever a row is inserted/deleted here.
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, persisted: false });
  }

  const supabase = createServiceClient();

  if (liked) {
    await supabase.from("likes").upsert(
      { product_id: productId, visitor_id: visitorId },
      { onConflict: "product_id,visitor_id" }
    );
  } else {
    await supabase.from("likes").delete().match({ product_id: productId, visitor_id: visitorId });
  }

  return NextResponse.json({ ok: true, persisted: true });
}
