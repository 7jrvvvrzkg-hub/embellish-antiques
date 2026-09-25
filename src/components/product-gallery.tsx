"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LogoMark } from "@/components/logo";
import type { ProductImage } from "@/lib/types";

/**
 * Full click-through / swipe-through gallery for the product detail page.
 * Replaces the old setup, which rendered a static primary image plus a
 * strip of thumbnails that were just other <ProductImage> instances with
 * no state tying them together — nothing was clickable, and there was no
 * way to page through a listing's other photos.
 */
export function ProductGallery({
  images,
  alt,
}: {
  images: ProductImage[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_30%_20%,var(--color-gold-soft),var(--color-cream-soft)_70%)]">
        <div className="flex h-full flex-col items-center justify-center gap-2 text-forest/50">
          <LogoMark className="h-12 w-12 opacity-60" />
          <span className="text-xs font-medium uppercase tracking-widest opacity-70">
            Photo coming soon
          </span>
        </div>
      </div>
    );
  }

  const current = images[index];
  const goTo = (i: number) => setIndex(((i % images.length) + images.length) % images.length);

  let touchStartX: number | null = null;

  return (
    <div className="flex flex-col gap-3">
      <div
        className="group relative aspect-square overflow-hidden rounded-3xl bg-cream-soft"
        onTouchStart={(e) => {
          touchStartX = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX === null) return;
          const delta = e.changedTouches[0].clientX - touchStartX;
          if (Math.abs(delta) > 40) goTo(delta > 0 ? index - 1 : index + 1);
          touchStartX = null;
        }}
      >
        <Image
          key={current.id}
          src={current.url}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => goTo(index - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-ink/60 p-2 text-cream opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => goTo(index + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-ink/60 p-2 text-cream opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <span className="absolute bottom-3 right-3 rounded-full bg-ink/60 px-2.5 py-1 text-[0.65rem] font-semibold text-cream backdrop-blur">
              {index + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2.5 sm:grid-cols-6">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`View photo ${i + 1}`}
              aria-current={i === index}
              className={`relative aspect-square overflow-hidden rounded-xl transition ${
                i === index
                  ? "ring-2 ring-pop ring-offset-2 ring-offset-cream"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img.url} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
