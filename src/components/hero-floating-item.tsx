"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// One real product photo per category (transparent cutouts the owner
// supplied), used in place of the old placeholder SVG urn illustration.
// Garden has no cutout yet — add one here (matching shape below) once it
// exists and it'll join the rotation automatically.
const POOL: { src: string; width: number; height: number }[] = [
  { src: "/hero/barware.png", width: 500, height: 500 },
  { src: "/hero/lighting.png", width: 298, height: 837 },
  { src: "/hero/decorative-accessories.png", width: 491, height: 508 },
  { src: "/hero/case-goods.png", width: 470, height: 531 },
  { src: "/hero/seating.png", width: 623, height: 400 },
  { src: "/hero/fireplace.png", width: 270, height: 924 },
];

// A fixed tilt, not an animation — picked once per mount alongside which
// item shows, so the piece reads as caught mid-air rather than standing
// perfectly upright. The gentle up/down float (see the `float-slow`
// keyframe in globals.css) is untouched.
function randomTilt() {
  const sign = Math.random() < 0.5 ? -1 : 1;
  return sign * (6 + Math.random() * 10); // 6–16deg either direction
}

export function HeroFloatingItem() {
  const [pick, setPick] = useState<{ item: (typeof POOL)[number]; tilt: number } | null>(null);

  // Random per page load — decided client-side on mount so every visit (not
  // just every build) can show a different piece, without fighting SSR.
  useEffect(() => {
    setPick({
      item: POOL[Math.floor(Math.random() * POOL.length)],
      tilt: randomTilt(),
    });
  }, []);

  if (!pick) return null;

  return (
    <div
      className="pointer-events-none absolute -right-10 top-8 hidden h-80 w-80 items-center justify-center sm:flex md:right-6 md:h-96 md:w-96"
      style={{ animation: "float-slow 7s ease-in-out infinite" }}
      aria-hidden="true"
    >
      <Image
        src={pick.item.src}
        alt=""
        width={pick.item.width}
        height={pick.item.height}
        className="h-auto max-h-full w-auto max-w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
        style={{ transform: `rotate(${pick.tilt}deg)` }}
      />
    </div>
  );
}
