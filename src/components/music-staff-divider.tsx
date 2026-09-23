"use client";

import Image from "next/image";
import { useMusicStore } from "@/lib/store/music";

// The Iongaf-style divider, rebuilt around the owner's own assets: five
// staff lines (thick, not a hairline) running the full height of the
// divider, perpendicular "bar lines" cutting across them at intervals, a
// treble clef sitting right on top — also rotated 90° — that doubles as the
// play/pause button, and three note graphics (a single note, a beamed pair,
// and an occasional triple-beamed note) that repeat down the line in a
// mixed, non-alternating order. The staff + bar-line pattern itself is a
// tiled image cropped directly from the approved mockup, not CSS-drawn —
// see the STAFF_WIDTH/STAFF_TILE_HEIGHT comment below for why.
//
// All notes move at the exact same speed on the exact same loop, just
// started at evenly-spaced points in that loop — a real conveyor belt,
// not independent notes drifting at their own pace.
//
// Two color states: a bland, muted staff while idle, and a vibrant pop of
// color once it's playing — two separate tile images, same geometry,
// different color. Blank and completely still by default: no notes, no
// motion anywhere on the staff, just the lines and a clef that gives a
// small periodic "shimmy" to hint it's clickable. Click it — the staff pops
// to its vibrant color and gets a slow opacity pulse, notes start moving
// down the line, and the track plays on repeat until it's clicked again
// (from the home page — that's the only place this button lives) or the
// page is fully reloaded. The play/pause state itself lives in
// useMusicStore (see src/lib/store/music.ts), not in this component,
// specifically so navigating to another page — which unmounts this
// component, since it's only rendered on the home page — doesn't stop the
// track. There's no hover tooltip on the icon — the shimmy vs. the static
// rotated clef is the only affordance, on purpose.
//
// Note timing is an approximation, not a real beat-match — matching notes
// to a track exactly needs audio analysis this app doesn't do. If you send
// timestamps/cue points for the track, those can drive this precisely.
// The third asset — a triple-beamed note — is noticeably busier than the
// other two, so it's sized a touch bigger to read clearly and sprinkled in
// only twice, far apart (see ASSET_PATTERN below), never back-to-back.
// Sizes below are scaled to match the approved mockup's own proportions —
// notes there sit at ~95% of the staff's width (STAFF_WIDTH = 107), not the
// much smaller size an earlier pass left in place here.
const NOTE_ASSET_INFO = [
  { src: "/music/note.png", box: 100, w: 136, h: 173 },
  { src: "/music/note2.png", box: 100, w: 136, h: 173 },
  { src: "/music/note3.png", box: 116, w: 157, h: 200 },
];
// The divider spans the full page height (not just one section), so the
// belt is long — a slower duration keeps the notes gliding instead of
// rocketing down the line.
const CONVEYOR_DURATION = 18;
// Far fewer notes than the very first pass (18 → 8) — the notes got resized
// much bigger to match the approved mockup's proportions (see
// NOTE_ASSET_INFO above), but the gap timings never got rescaled to match,
// so at the old count/spacing they crowded each other even after a first
// widening pass (12 notes / 1.0s minimum still measured out to a ~44px gap
// on this page's actual scroll speed — under half a note's own height).
// Fewer notes sharing the same CONVEYOR_DURATION means more belt per note.
const NOTE_COUNT = 8;
// Which note graphic each slot uses — deliberately NOT a strict alternation,
// so the mix reads as varied rather than mechanical. The two `2`s (the
// triple-beamed note) sit far apart in the loop, on purpose.
const ASSET_PATTERN = [0, 1, 2, 0, 1, 1, 2, 0];
// Tight jitter around the bar's own center (each note is also centered on
// `left` via translateX below, not left-edge-anchored) so they stay riding
// the bar instead of drifting off it.
const LEFT_PATTERN = [50, 44, 56, 42, 58, 46, 52, 44];
// The gap, in seconds, from each note to the next one behind it on the
// belt — deliberately UNEVEN (some notes trail closer behind each other,
// some have a long stretch of empty line before the next one) rather than
// one fixed spacing repeated down the whole line. They still all share the
// same travel speed/duration below. Measured against this page's actual
// scroll speed, the minimum gap here works out to roughly a note's own
// height of clear space — comfortably spaced, never crowded. The gaps sum
// to exactly CONVEYOR_DURATION so the loop repeats seamlessly.
const GAPS = [1.8, 2.8, 1.6, 3.0, 1.8, 2.4, 2.8, 1.8];
const NOTES = (() => {
  let cumulative = 0;
  return Array.from({ length: NOTE_COUNT }, (_, i) => {
    const delay = -cumulative;
    cumulative += GAPS[i];
    return { left: LEFT_PATTERN[i], ...NOTE_ASSET_INFO[ASSET_PATTERN[i]], delay };
  });
})();

// The staff + bar-line pattern is no longer hand-drawn in CSS — after two
// rounds of "this doesn't match the approved image," it's now a literal
// pixel crop FROM the approved idle mockup (one full bar-to-bar period,
// 107x220, seamless top-to-bottom so it tiles with no visible seam) baked
// into two transparent PNGs, one per color state — see
// public/music/staff-tile-idle.png / staff-tile-playing.png. Same geometry
// as the source image, guaranteed, because it *is* the source image, not a
// re-derived approximation.
const STAFF_WIDTH = 107;
const STAFF_TILE_HEIGHT = 220;

export function MusicStaffDivider({ className = "" }: { className?: string }) {
  const playing = useMusicStore((s) => s.playing);
  const toggle = useMusicStore((s) => s.toggle);

  return (
    <div className={`flex w-36 flex-col items-center ${className}`}>
      {/* The staff lines + bar lines, tiled down the full height of the
          divider from the exact approved crop. Position is always fixed —
          never animated — so it can never be caught mid-cycle looking
          blank the way the old scrolling-background version could; the
          "moving while playing" feel instead comes from a gentle opacity
          pulse, which can't fully disappear at any frame. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 z-0 -translate-x-1/2"
        style={{
          width: STAFF_WIDTH,
          backgroundImage: `url(${playing ? "/music/staff-tile-playing.png" : "/music/staff-tile-idle.png"})`,
          backgroundRepeat: "repeat-y",
          backgroundSize: `${STAFF_WIDTH}px ${STAFF_TILE_HEIGHT}px`,
          animation: playing ? "staff-pulse 2.2s ease-in-out infinite" : undefined,
        }}
      />

      {/* Sized to match the approved mockup's own proportions: there the
          clef is noticeably wider than the staff, clearly overhanging the
          outer lines on both sides — not the much smaller, staff-width-or-
          under size an earlier pass left in place here. 150px comfortably
          clears the staff (107px) on both sides while staying inside this
          divider's own reserved column, so it never reaches into the page
          content beside it. */}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Pause background music" : "Play background music"}
        className="relative z-10 flex shrink-0 items-center justify-center rounded-full outline-none transition hover:scale-105 active:scale-95"
      >
        <Image
          src="/music/clef.png"
          alt=""
          width={150}
          height={150}
          className={`h-[150px] w-[150px] object-contain drop-shadow-md ${!playing ? "animate-[clef-shimmy_4s_ease-in-out_infinite]" : "rotate-90"}`}
        />
      </button>

      {/* Notes travel down the bar — same duration, same loop, only their
          start point differs, so they move as one evenly-spaced conveyor
          rather than drifting past each other at different speeds. Each
          note is centered on its `left` percentage (not left-edge-anchored)
          so it actually rides the bar instead of drifting off it. */}
      <div className="relative z-[1] w-full flex-1 overflow-hidden">
        {playing &&
          NOTES.map((note, i) => (
            <span
              key={i}
              className="absolute -translate-x-1/2"
              style={{
                left: `${note.left}%`,
                width: note.box,
                height: note.box,
                animation: `note-carousel ${CONVEYOR_DURATION}s linear ${note.delay}s infinite`,
              }}
            >
              <Image
                src={note.src}
                alt=""
                width={note.w}
                height={note.h}
                className="h-full w-full rotate-90 object-contain drop-shadow"
              />
            </span>
          ))}
      </div>
    </div>
  );
}
