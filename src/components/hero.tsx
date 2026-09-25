import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { HeroFloatingItem } from "@/components/hero-floating-item";
import { CATEGORY_LIST } from "@/lib/categories";

/**
 * Popped-color hero built to carry the page. A real product photo (one per
 * category, picked at random on each load — see hero-floating-item.tsx)
 * floats gently behind the headline, and a marquee of category names runs
 * underneath for texture.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-b-[2.5rem] bg-forest text-cream sm:rounded-b-[3.5rem]">
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-pop/30 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
      </div>

      <HeroFloatingItem />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-cream/25 bg-cream/10 px-4 py-1.5 text-xs font-medium tracking-wide backdrop-blur">
          <LogoMark className="h-3.5 w-3.5" /> Durham, NC · Shipping nationwide &amp; worldwide
        </div>

        <h1 className="mt-6 max-w-2xl font-display text-4xl italic leading-[1.05] sm:text-6xl">
          Beautifully <span className="text-pop">peculiar</span> antiques, found and re-homed.
        </h1>

        <p className="mt-5 max-w-lg text-base text-cream/80 sm:text-lg">
          Every piece is hand-selected, one of a kind, and won&apos;t come around twice —
          from Art Deco barware to monumental French lanterns.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/shop/new-arrivals"
            className="rounded-full bg-pop px-6 py-3 text-sm font-semibold text-cream shadow-pop transition hover:bg-pop-dark"
          >
            Shop New Arrivals
          </Link>
          <Link
            href="/about"
            className="rounded-full border border-cream/40 px-6 py-3 text-sm font-semibold text-cream transition hover:border-cream hover:bg-cream/10"
          >
            Our Story
          </Link>
        </div>
      </div>

      <div className="relative overflow-hidden border-t border-cream/10 py-3">
        <div className="flex w-max gap-10 whitespace-nowrap text-xs font-medium uppercase tracking-[0.3em] text-cream/50" style={{ animation: "marquee 28s linear infinite" }}>
          {[...CATEGORY_LIST, ...CATEGORY_LIST].map((c, i) => (
            <span key={i}>{c.label}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
