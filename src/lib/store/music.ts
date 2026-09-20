"use client";

import { create } from "zustand";

// The background track needs to keep playing across page navigation — the
// visible staff/clef divider only renders on the home page, but a click
// there should keep the music going no matter where you browse to next,
// stopping only when you're back on the home page and click it again (or
// the page is fully reloaded).
//
// That means the actual `Audio` object and "is it playing" flag can't live
// inside the divider component's own state — that component unmounts the
// instant you navigate to another page (it's homepage-only), which would
// tear down the audio with it. Both live here instead, in a plain module
// singleton + a Zustand store, neither of which is tied to any component's
// mount lifecycle — they only go away on a full page reload, same as the
// spec asks for.
let audio: HTMLAudioElement | null = null;

interface MusicState {
  playing: boolean;
  toggle: () => void;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  playing: false,
  toggle: () => {
    if (get().playing) {
      audio?.pause();
      set({ playing: false });
      return;
    }
    if (!audio) {
      audio = new Audio("/music/track.mp3");
      audio.loop = true;
    }
    audio.play().catch(() => {
      // Autoplay-with-sound can be blocked before any user gesture has
      // landed elsewhere on the page — the click that got us here counts,
      // so this mainly guards odd browser edge cases.
    });
    set({ playing: true });
  },
}));
