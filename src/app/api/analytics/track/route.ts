import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    eventType: "category_view" | "product_click" | "product_view";
    category?: string;
    productId?: string;
  };

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, persisted: false });
  }

  const supabase = createServiceClient();
  await supabase.from("analytics_events").insert({
    event_type: body.eventType,
    category: body.category ?? null,
    product_id: body.productId ?? null,
  });

  if (body.eventType === "product_click" && body.productId) {
    await supabase.rpc("increment_click_count", { p_product_id: body.productId }).select();
  }

  return NextResponse.json({ ok: true, persisted: true });
}
