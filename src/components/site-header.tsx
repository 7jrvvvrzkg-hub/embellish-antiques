"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, ChevronDown } from "lucide-react";
import { Logo } from "@/components/logo";
import { AnimatedSearchBar } from "@/components/animated-search-bar";
import { useCart } from "@/lib/store/cart";
import { CATEGORY_LIST } from "@/lib/categories";

export function SiteHeader({ searchWords }: { searchWords: string[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const totalCount = useCart((s) => s.totalCount());
  const openCart = useCart((s) => s.open);

  // Close the mobile drawer on route changes handled by Link's default
  // behavior; this just prevents a stuck-open drawer on resize to desktop.
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/90 backdrop-blur-md">
      {/* Top-most strip — replaces the old chat-with-us bar with something useful */}
      <div className="hidden bg-forest px-4 py-1.5 text-center text-[0.7rem] tracking-wide text-cream/90 sm:block">
        Complimentary US shipping · Curated pieces added weekly
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <button
          className="-ml-2 rounded-full p-2 text-ink lg:hidden"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>

        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex lg:pl-4">
          <div
            className="group relative"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-ink transition hover:text-pop">
              Shop <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {categoriesOpen && (
              <div className="absolute left-1/2 top-full w-64 -translate-x-1/2 pt-3">
                <div className="grid grid-cols-2 gap-1 rounded-2xl border border-line bg-cloud p-3 shadow-soft">
                  {CATEGORY_LIST.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/shop/${c.slug}`}
                      className="rounded-lg px-3 py-2 text-sm text-ink-soft transition hover:bg-cream-soft hover:text-pop"
                    >
                      {c.label}
                    </Link>
                  ))}
                  <Link
                    href="/shop/new-arrivals"
                    className="col-span-2 rounded-lg px-3 py-2 text-sm font-semibold text-pop transition hover:bg-cream-soft"
                  >
                    New Arrivals
                  </Link>
                </div>
              </div>
            )}
          </div>
          <Link href="/about" className="text-sm font-medium text-ink transition hover:text-pop">
            About
          </Link>
          <Link href="/sold-archive" className="text-sm font-medium text-ink transition hover:text-pop">
            Sold Archive
          </Link>
          <Link href="/contact" className="text-sm font-medium text-ink transition hover:text-pop">
            Contact
          </Link>
        </nav>

        <div className="ml-auto hidden max-w-xs flex-1 md:block">
          <AnimatedSearchBar words={searchWords} />
        </div>

        <button
          className="relative ml-auto rounded-full p-2 text-ink transition hover:text-pop md:ml-2"
          aria-label="Open bag"
          onClick={openCart}
        >
          <ShoppingBag className="h-6 w-6" />
          {totalCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pop px-1 text-[0.65rem] font-bold text-cream">
              {totalCount}
            </span>
          )}
        </button>
      </div>

      <div className="px-4 pb-3 md:hidden">
        <AnimatedSearchBar words={searchWords} />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col overflow-y-auto rounded-r-3xl bg-cream p-6 shadow-soft">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <button
                aria-label="Close menu"
                className="rounded-full p-2"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-soft">
              Shop by category
            </p>
            <div className="mb-6 flex flex-col gap-1">
              {CATEGORY_LIST.map((c) => (
                <Link
                  key={c.slug}
                  href={`/shop/${c.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-3 text-base text-ink transition active:bg-cream-soft"
                >
                  {c.label}
                </Link>
              ))}
              <Link
                href="/shop/new-arrivals"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-semibold text-pop transition active:bg-cream-soft"
              >
                New Arrivals
              </Link>
            </div>
            <div className="flex flex-col gap-1 border-t border-line pt-4">
              {[
                ["About", "/about"],
                ["Sold Archive", "/sold-archive"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-3 text-base text-ink transition active:bg-cream-soft"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
