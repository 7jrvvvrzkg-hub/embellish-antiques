"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// The Iongaf-style divider, rebuilt around the owner's own assets: the
// actual "bar" graphic (a thick, real staff-line asset) tiled the full
// height of the divider, a treble clef sitting right on top of it — also
// rotated 90° — that doubles as the play/pause button, and two note
// graphics (a single note and a beamed pair) that repeat down the line.
//
// All notes move at the exact same speed on the exact same loop, just
// started at evenly-spaced points in that loop — a real conveyor belt,
// not independent notes drifting at their own pace.
//
// Blank by default: no notes, nothing moving, just the staff line and a
// clef that gives a small periodic "shimmy" to hint it's clickable. Click
// it — notes start moving down the line and the track plays on repeat
// until it's clicked again or the page reloads. Click again to stop.
// There's no hover tooltip on the icon — the shimmy vs. the static rotated
// clef is the only affordance, on purpose.
//
// Note timing is an approximation, not a real beat-match — matching notes
// to a track exactly needs audio analysis this app doesn't do. If you send
// timestamps/cue points for the track, those can drive this precisely.
const NOTE_ASSETS = ["/music/note.png", "/music/note2.png"];
// The divider now spans the full page height (not just one section), so
// the belt is much longer — a slower duration keeps the notes gliding
// instead of rocketing down the line.
const CONVEYOR_DURATION = 16;
const NOTE_COUNT = 8;
const NOTES = Array.from({ length: NOTE_COUNT }, (_, i) => ({
  // Tight jitter around the bar's own center (each note is also centered
  // on `left` via translateX below, not left-edge-anchored) so they stay
  // riding on the bar instead of drifting off it.
  left: [46, 54, 50, 58, 44, 52, 48, 56][i],
  asset: NOTE_ASSETS[i % NOTE_ASSETS.length],
  // Evenly spaced starting points around the SAME loop, at the SAME
  // duration below — that's what makes it read as one conveyor belt of
  // notes instead of several notes each falling at their own speed.
  delay: -((CONVEYOR_DURATION / NOTE_COUNT) * i),
}));

export function MusicStaffDivider({ className = "" }: { className?: string }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  function toggle() {
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }
    if (!audioRef.current) {
      audioRef.current = new Audio("/music/track.mp3");
      audioRef.current.loop = true;
    }
    audioRef.current.play().catch(() => {
      // Autoplay-with-sound can be blocked before any user gesture has
      // landed elsewhere on the page — the click that got us here counts,
      // so this mainly guards odd browser edge cases.
    });
    setPlaying(true);
  }

  return (
    <div className={`flex w-32 flex-col items-center ${className}`}>
      {/* The actual bar asset, tiled the full height of the divider —
          starts at the very top so the clef button sits right on it,
          rather than floating above a gap. Sized up so it reads as a
          real, thick bar rather than a hairline. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 bottom-0 z-0 bg-center bg-repeat-y"
        style={{ backgroundImage: "url(/music/bar.png)", backgroundSize: "72px auto" }}
      />

      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Pause background music" : "Play background music"}
        className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full outline-none transition hover:scale-105 active:scale-95"
      >
        <Image
          src="/music/clef.png"
          alt=""
          width={90}
          height={90}
          className={`h-14 w-14 object-contain drop-shadow-md ${!playing ? "animate-[clef-shimmy_4s_ease-in-out_infinite]" : "rotate-90"}`}
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
              className="absolute h-9 w-9 -translate-x-1/2"
              style={{
                left: `${note.left}%`,
                animation: `note-carousel ${CONVEYOR_DURATION}s linear ${note.delay}s infinite`,
              }}
            >
              <Image
                src={note.asset}
                alt=""
                width={60}
                height={76}
                className="h-full w-full rotate-90 object-contain drop-shadow"
              />
            </span>
          ))}
      </div>
    </div>
  );
}
