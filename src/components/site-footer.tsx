"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/logo";
import { CATEGORY_LIST } from "@/lib/categories";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer className="mt-24 border-t border-line bg-forest text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo className="text-cream" />
          <p className="mt-4 max-w-xs text-sm text-cream/70">
            One-of-a-kind antiques and vintage pieces, sourced and shipped from our
            Durham, NC warehouse — nationwide and worldwide.
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="rounded-full border border-cream/30 p-2 transition hover:border-pop hover:text-pop"
            >
              <InstagramGlyph className="h-4 w-4" />
            </a>
            <a
              href="mailto:hello@embellishantiques.com"
              aria-label="Email"
              className="rounded-full border border-cream/30 p-2 transition hover:border-pop hover:text-pop"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-cream/60">Shop</p>
          <ul className="mt-4 space-y-2 text-sm">
            {CATEGORY_LIST.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/shop/${c.slug}`} className="text-cream/80 transition hover:text-pop">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-cream/60">Info</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/about" className="text-cream/80 transition hover:text-pop">About</Link></li>
            <li><Link href="/sold-archive" className="text-cream/80 transition hover:text-pop">Sold Archive</Link></li>
            <li><Link href="/shipping-returns" className="text-cream/80 transition hover:text-pop">Shipping &amp; Returns</Link></li>
            <li><Link href="/contact" className="text-cream/80 transition hover:text-pop">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-cream/60">
            Join the list
          </p>
          <p className="mt-4 text-sm text-cream/70">
            New arrivals and one-of-a-kind finds, straight to your inbox.
          </p>
          {status === "done" ? (
            <p className="mt-3 text-sm text-gold-soft">You&apos;re on the list — thank you!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-full border border-cream/30 bg-transparent px-4 py-2 text-sm placeholder:text-cream/40 outline-none focus:border-pop"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="shrink-0 rounded-full bg-pop px-4 py-2 text-sm font-semibold text-cream transition hover:bg-pop-dark disabled:opacity-60"
              >
                Join
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="mt-2 text-xs text-cream/60">Something went wrong — try again in a moment.</p>
          )}
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-cream/50 sm:flex-row sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} Embellish Antiques. All rights reserved.</span>
          <span>
            Made by{" "}
            <a
              href="https://bownode.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-cream/80 underline decoration-gold-soft underline-offset-2 transition hover:text-pop"
            >
              Bownode LLC
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

// lucide-react dropped brand icons, so this is a tiny hand-drawn stand-in —
// keeps the footer from depending on a brand-icon package for one glyph.
function InstagramGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}
