import type { Metadata } from "next";
// Self-hosted via npm (@fontsource-variable) rather than next/font/google —
// no runtime dependency on Google's font CDN (nice for privacy/consistency,
// and means the build never depends on reaching fonts.googleapis.com).
import "@fontsource-variable/fraunces/wght.css";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource-variable/inter/wght.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Embellish Antiques — One-of-a-kind antiques & vintage finds",
    template: "%s · Embellish Antiques",
  },
  description:
    "Hand-selected antiques and vintage pieces — barware, lighting, case goods, seating and more — shipped nationwide and worldwide from Durham, NC.",
};

// Deliberately minimal: html/body/fonts/metadata only. The customer shop
// gets its header/footer/cart drawer from app/(site)/layout.tsx, and /admin
// gets its own shell from app/admin/(dashboard)/layout.tsx — neither
// should inherit the other's chrome.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-cream text-ink">{children}</body>
    </html>
  );
}
