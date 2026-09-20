"use client";

import { useTransition } from "react";
import { setProductStatus, deleteProduct } from "@/lib/data/admin-actions";
import type { Product } from "@/lib/types";

export function StatusButtons({ product }: { product: Product }) {
  const [pending, startTransition] = useTransition();

  function setStatus(status: "available" | "sold" | "draft") {
    startTransition(async () => {
      await setProductStatus(product.id, status);
    });
  }

  function handleDelete() {
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    startTransition(async () => {
      await deleteProduct(product.id);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      {(["available", "sold", "draft"] as const).map((s) => (
        <button
          key={s}
          disabled={pending}
          onClick={() => setStatus(s)}
          className={`rounded-full px-2.5 py-1 font-medium capitalize transition ${
            product.status === s ? "bg-forest text-cream" : "bg-cream-soft text-ink-soft hover:bg-line"
          }`}
        >
          {s}
        </button>
      ))}
      <button
        disabled={pending}
        onClick={handleDelete}
        className="ml-1 rounded-full px-2.5 py-1 font-medium text-pop-dark hover:bg-pop/10"
      >
        Delete
      </button>
    </div>
  );
}
