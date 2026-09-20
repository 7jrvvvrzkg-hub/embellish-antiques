"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

const TYPE_SPEED_MS = 70;
const DELETE_SPEED_MS = 35;
const PAUSE_AFTER_TYPE_MS = 1400;
const PAUSE_AFTER_DELETE_MS = 300;

/**
 * The Depop-style search bar: when the field is empty, the placeholder
 * types out a real item name, sits for a beat, then backspaces itself and
 * moves on to the next one. Typing anything for real stops the animation
 * instantly and never fights the user's input.
 */
export function AnimatedSearchBar({
  words,
  className = "",
}: {
  words: string[];
  className?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [placeholder, setPlaceholder] = useState("Search the shop…");
  const [focused, setFocused] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!words.length || focused || value) return;

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const word = `Try “${words[wordIndex % words.length]}”`;

      if (!deleting) {
        charIndex++;
        setPlaceholder(word.slice(0, charIndex));
        if (charIndex >= word.length) {
          deleting = true;
          timeoutRef.current = setTimeout(tick, PAUSE_AFTER_TYPE_MS);
          return;
        }
        timeoutRef.current = setTimeout(tick, TYPE_SPEED_MS);
      } else {
        charIndex--;
        setPlaceholder(word.slice(0, charIndex));
        if (charIndex <= 0) {
          deleting = false;
          wordIndex++;
          timeoutRef.current = setTimeout(tick, PAUSE_AFTER_DELETE_MS);
          return;
        }
        timeoutRef.current = setTimeout(tick, DELETE_SPEED_MS);
      }
    };

    timeoutRef.current = setTimeout(tick, 500);
    return () => {
      cancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [words, focused, value]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (q) router.push(`/shop?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
        strokeWidth={2}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={focused ? "Search the shop…" : `${placeholder}${value ? "" : "▍"}`}
        aria-label="Search the shop"
        className="w-full rounded-full border border-line bg-cloud py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink-soft/70 outline-none transition focus:border-pop focus:ring-2 focus:ring-pop/20"
      />
    </form>
  );
}
