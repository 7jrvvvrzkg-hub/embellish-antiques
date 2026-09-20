"use client";

import Image from "next/image";
import { useMusicStore } from "@/lib/store/music";

// The Iongaf-style divider, rebuilt around the owner's own assets: five
// hand-drawn staff lines (thick, not a hairline) running the full height of
// the divider, perpendicular "bar lines" cutting across them at intervals, a
// treble clef sitting right on top — also rotated 90° — that doubles as the
// play/pause button, and three note graphics (a single note, a beamed pair,
// and an occasional triple-beamed note) that repeat down the line in a
// mixed, non-alternating order.
//
// All notes move at the exact same speed on the exact same loop, just
// started at evenly-spaced points in that loop — a real conveyor belt,
// not independent notes drifting at their own pace.
//
// Two color states: a bland, muted staff while idle, and a vibrant pop of
// color once it's playing — see `staffColor` below. Blank and completely
// still by default: no notes, no motion anywhere on the staff, just the
// lines and a clef that gives a small periodic "shimmy" to hint it's
// clickable. Click it — the staff pops to its vibrant color and starts
// moving (the bar lines drift slowly down the staff, each line gets a
// slight staggered sway), notes start moving down the line, and the track
// plays on repeat until it's clicked again (from the home page — that's the
// only place this button lives) or the page is fully reloaded. The
// play/pause state itself lives in useMusicStore (see src/lib/store/music.ts),
// not in this component, specifically so navigating to another page — which
// unmounts this component, since it's only rendered on the home page —
// doesn't stop the track. There's no hover tooltip on the icon — the shimmy
// vs. the static rotated clef is the only affordance, on purpose.
//
// Note timing is an approximation, not a real beat-match — matching notes
// to a track exactly needs audio analysis this app doesn't do. If you send
// timestamps/cue points for the track, those can drive this precisely.
// The third asset — a triple-beamed note — is noticeably busier than the
// other two, so it's sized a touch bigger to read clearly and sprinkled in
// only twice, far apart (see ASSET_PATTERN below), never back-to-back.
const NOTE_ASSET_INFO = [
  { src: "/music/note.png", box: 44, w: 60, h: 76 },
  { src: "/music/note2.png", box: 44, w: 60, h: 76 },
  { src: "/music/note3.png", box: 51, w: 69, h: 88 },
];
// The divider spans the full page height (not just one section), so the
// belt is long — a slower duration keeps the notes gliding instead of
// rocketing down the line.
const CONVEYOR_DURATION = 18;
const NOTE_COUNT = 18;
// Which note graphic each slot uses — deliberately NOT a strict alternation,
// so the mix reads as varied rather than mechanical. The two `2`s (the
// triple-beamed note) sit far apart in the loop, on purpose.
const ASSET_PATTERN = [0, 1, 1, 0, 2, 0, 0, 1, 0, 1, 1, 0, 1, 2, 0, 1, 1, 0];
// Tight jitter around the bar's own center (each note is also centered on
// `left` via translateX below, not left-edge-anchored) so they stay riding
// the bar instead of drifting off it.
const LEFT_PATTERN = [52, 46, 54, 42, 44, 58, 44, 52, 60, 42, 58, 48, 42, 44, 54, 44, 48, 44];
// The gap, in seconds, from each note to the next one behind it on the
// belt — deliberately UNEVEN (some notes trail close behind each other,
// some have a long stretch of empty line before the next one) rather than
// one fixed spacing repeated down the whole line. They still all share the
// same travel speed/duration below, and every gap is large enough that two
// notes are never riding on top of each other; the gaps sum to exactly
// CONVEYOR_DURATION so the loop repeats seamlessly.
const GAPS = [0.28, 1.58, 0.37, 1.95, 0.46, 0.93, 1.76, 0.32, 1.11, 2.23, 0.37, 0.84, 1.48, 0.42, 1.86, 0.56, 1.02, 0.46];
const NOTES = (() => {
  let cumulative = 0;
  return Array.from({ length: NOTE_COUNT }, (_, i) => {
    const delay = -cumulative;
    cumulative += GAPS[i];
    return { left: LEFT_PATTERN[i], ...NOTE_ASSET_INFO[ASSET_PATTERN[i]], delay };
  });
})();

// Staff width, in px: five 7px lines + four 18px gaps between them — the bar
// lines below are sized to land exactly flush with the outer two lines, no
// overhang past either edge.
const STAFF_LINE_WIDTH = 7;
const STAFF_LINE_GAP = 18;
const STAFF_WIDTH = 5 * STAFF_LINE_WIDTH + 4 * STAFF_LINE_GAP;
// How far apart the bar lines (the perpendicular "measure" lines cutting
// across the staff) sit, and how thick each one is.
const BAR_LINE_SPACING = 360;
const BAR_LINE_THICKNESS = 8;

export function MusicStaffDivider({ className = "" }: { className?: string }) {
  const playing = useMusicStore((s) => s.playing);
  const toggle = useMusicStore((s) => s.toggle);

  // Bland/muted while idle, a vibrant pop of color once the music's
  // actually playing — same two colors drive both the vertical staff lines
  // and the bar lines cutting across them, so the whole staff reads as one
  // thing that "turns on."
  const staffColor = playing ? "var(--color-pop)" : "var(--color-staff-idle)";

  return (
    <div className={`flex w-36 flex-col items-center ${className}`}>
      {/* Five hand-drawn staff lines, running the full height of the
          divider — starts at the very top so the clef button sits right on
          it, rather than floating above a gap. Thick lines with generous
          gaps so it reads as a real staff, not a hairline. Completely still
          and bland-colored while idle; once playing, they pop to a vibrant
          color and get a slight staggered sway, like a struck string. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 bottom-0 z-0 flex justify-center gap-[18px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="h-full rounded-full transition-colors duration-500"
            style={{
              width: STAFF_LINE_WIDTH,
              backgroundColor: staffColor,
              animation: playing ? `staff-sway 2.2s ease-in-out ${i * 0.15}s infinite` : undefined,
            }}
          />
        ))}
      </div>

      {/* Bar lines: perpendicular "measure" lines cutting across all five
          staff lines, flush with the outer two (no overhang). A single
          repeating gradient — rather than a fixed number of elements — so
          it always covers the divider's full height, whatever that is.
          Static while idle; while playing, the pattern drifts slowly
          downward, one full interval per loop, so it reads as the staff
          itself moving rather than just recoloring. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 z-0 -translate-x-1/2 transition-[background-image] duration-500"
        style={{
          width: STAFF_WIDTH,
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${
            BAR_LINE_SPACING - BAR_LINE_THICKNESS
          }px, ${staffColor} ${BAR_LINE_SPACING - BAR_LINE_THICKNESS}px, ${staffColor} ${BAR_LINE_SPACING}px)`,
          animation: playing ? `staff-scroll 6s linear infinite` : undefined,
        }}
      />

      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Pause background music" : "Play background music"}
        className="relative z-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-full outline-none transition hover:scale-105 active:scale-95"
      >
        <Image
          src="/music/clef.png"
          alt=""
          width={110}
          height={110}
          className={`h-16 w-16 object-contain drop-shadow-md ${!playing ? "animate-[clef-shimmy_4s_ease-in-out_infinite]" : "rotate-90"}`}
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
