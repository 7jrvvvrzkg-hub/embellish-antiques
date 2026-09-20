"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { createServiceClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/format";
import type { Category } from "@/lib/types";

type ActionResult = { ok: boolean; message?: string };

const NOT_CONFIGURED: ActionResult = {
  ok: false,
  message: "Connect Supabase (see the README) to save real changes — this panel is a preview until then.",
};

function revalidateShop() {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/items");
}

export async function createProduct(formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "") as Category;
  const priceCents = Math.round(parseFloat(String(formData.get("price") ?? "0")) * 100) || 0;
  if (!name || !category) return { ok: false, message: "Name and category are required." };

  const supabase = createServiceClient();
  const { error } = await supabase.from("products").insert({
    slug: `${slugify(name)}-${Date.now().toString(36)}`,
    name,
    description: String(formData.get("description") ?? ""),
    price_cents: priceCents,
    category,
    era: String(formData.get("era") ?? "") || null,
    materials: String(formData.get("materials") ?? "") || null,
    dimensions: String(formData.get("dimensions") ?? "") || null,
    condition: String(formData.get("condition") ?? "") || null,
    status: "available",
    is_new_arrival: formData.get("isNewArrival") === "on",
  });

  if (error) return { ok: false, message: error.message };
  revalidateShop();
  return { ok: true };
}

export async function updateProduct(id: string, formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const priceCents = Math.round(parseFloat(String(formData.get("price") ?? "0")) * 100) || 0;
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("products")
    .update({
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      price_cents: priceCents,
      category: String(formData.get("category") ?? ""),
      era: String(formData.get("era") ?? "") || null,
      materials: String(formData.get("materials") ?? "") || null,
      dimensions: String(formData.get("dimensions") ?? "") || null,
      condition: String(formData.get("condition") ?? "") || null,
      is_new_arrival: formData.get("isNewArrival") === "on",
    })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };
  revalidateShop();
  revalidatePath(`/admin/items/${id}`);
  return { ok: true };
}

export async function setProductStatus(
  id: string,
  status: "available" | "sold" | "draft"
): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("products")
    .update({ status, sold_at: status === "sold" ? new Date().toISOString() : null })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };
  revalidateShop();
  revalidatePath("/sold-archive");
  return { ok: true };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const supabase = createServiceClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidateShop();
  return { ok: true };
}

export async function uploadProductImage(productId: string, formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { ok: false, message: "Choose an image first." };

  const supabase = createServiceClient();
  const path = `${productId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "")}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(path, file, { contentType: file.type });
  if (uploadError) return { ok: false, message: uploadError.message };

  const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(path);

  const { count } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  const { error: insertError } = await supabase
    .from("product_images")
    .insert({ product_id: productId, url: publicUrl.publicUrl, position: count ?? 0 });
  if (insertError) return { ok: false, message: insertError.message };

  revalidateShop();
  revalidatePath(`/admin/items/${productId}`);
  return { ok: true };
}

export async function deleteProductImage(imageId: string, productId: string): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;
  const supabase = createServiceClient();
  const { error } = await supabase.from("product_images").delete().eq("id", imageId);
  if (error) return { ok: false, message: error.message };
  revalidateShop();
  revalidatePath(`/admin/items/${productId}`);
  return { ok: true };
}

// Called after a drag-reorder on the admin item page — `orderedIds` is the
// full list of that product's image ids in their new order; position 0
// becomes the primary/first image shown everywhere on the site.
export async function reorderProductImages(productId: string, orderedIds: string[]): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;
  const supabase = createServiceClient();

  await Promise.all(
    orderedIds.map((id, index) => supabase.from("product_images").update({ position: index }).eq("id", id))
  );

  revalidateShop();
  revalidatePath(`/admin/items/${productId}`);
  return { ok: true };
}
