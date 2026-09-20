"use client";

import { useEffect, useRef, useState } from "react";
import { Music2 } from "lucide-react";

/**
 * The "little line of music" widget from the Iongaf reference: a vertical
 * staff with a treble clef. Click it and notes start drawing themselves
 * onto the staff while a track plays softly in the background as you
 * browse; click again to stop.
 *
 * No real track exists yet, so this generates a soft, generative pentatonic
 * arpeggio with the Web Audio API instead of shipping a placeholder MP3 —
 * once you send the real track, drop it at /public/music/track.mp3 and
 * swap the `startPlaceholderTone`/`stopPlaceholderTone` calls below for a
 * plain <audio> element;
 * everything else (the click target, the note animation, the playing
 * state) stays the same.
 */
export function MusicStaffDivider({ className = "" }: { className?: string }) {
  const [playing, setPlaying] = useState(false);
  const [hovering, setHovering] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      stopPlaceholderTone();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function playNote(ctx: AudioContext, freq: number, startAt: number, duration: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, startAt);
    gain.gain.linearRampToValueAtTime(0.05, startAt + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(startAt);
    osc.stop(startAt + duration + 0.05);
  }

  function startPlaceholderTone() {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;
    // A gentle-sounding pentatonic scale — never lands on a jarring interval.
    const scale = [261.6, 293.7, 329.6, 392.0, 440.0, 523.3];
    let step = 0;
    const playStep = () => {
      const freq = scale[Math.floor(Math.random() * scale.length)] * (step % 8 === 0 ? 0.5 : 1);
      playNote(ctx, freq, ctx.currentTime, 1.1);
      step++;
    };
    playStep();
    intervalRef.current = setInterval(playStep, 900);
  }

  function stopPlaceholderTone() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
  }

  function toggle() {
    if (playing) {
      stopPlaceholderTone();
      setPlaying(false);
    } else {
      startPlaceholderTone();
      setPlaying(true);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      aria-pressed={playing}
      aria-label={playing ? "Pause background music" : "Play background music"}
      className={`group relative flex h-full min-h-[320px] w-16 flex-col items-center justify-center gap-3 rounded-full py-6 text-forest outline-none ${className}`}
    >
      {hovering && (
        <span className="absolute left-full ml-3 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-cream shadow-soft">
          {playing ? "Playing — click to pause" : "Click for a little ambience"}
        </span>
      )}

      <Music2
        className={`h-6 w-6 shrink-0 text-gold transition-transform ${playing ? "scale-110" : ""}`}
      />

      <span className="relative flex-1">
        {/* five staff lines */}
        <span className="absolute inset-0 flex justify-between px-[1px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="h-full w-px bg-forest/25" />
          ))}
        </span>

        {/* animated notes, only visible/animating while playing */}
        {playing && (
          <svg
            className="relative h-full w-8"
            viewBox="0 0 32 200"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {[20, 55, 95, 135, 170].map((y, i) => (
              <g key={i} style={{ animation: `staff-note-draw 2.4s ease-in-out ${i * 0.5}s infinite` }}>
                <circle cx={16 + (i % 2 === 0 ? -6 : 6)} cy={y} r="4.5" fill="#c69a3a" />
                <line
                  x1={16 + (i % 2 === 0 ? -1.6 : 10.6)}
                  y1={y}
                  x2={16 + (i % 2 === 0 ? -1.6 : 10.6)}
                  y2={y - 22}
                  stroke="#c69a3a"
                  strokeWidth="2"
                />
              </g>
            ))}
          </svg>
        )}
      </span>
    </button>
  );
}
