// Placeholder brand mark for Embellish Antiques — a simple line-art amphora
// inside a ring, paired with a serif wordmark. This is a stand-in built so
// the site has *a* real, cohesive identity to launch with; swap it for the
// owner's actual logo preferences (ask: initials vs. full name, any motif
// he already associates with the shop, color constraints) and this
// component is the only place that needs to change — everything else
// (favicon, admin header, email templates) imports from here.

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="23" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M18 12h12v3.2c0 1.6.9 2.4 1.8 3.4 1.6 1.8 2.7 4 2.7 7.1 0 5.9-4.2 9.8-10.5 9.8s-10.5-3.9-10.5-9.8c0-3.1 1.1-5.3 2.7-7.1.9-1 1.8-1.8 1.8-3.4V12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M18 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15.5 26.5c1.8 1.6 4.6 2.5 8.5 2.5s6.7-.9 8.5-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({
  className = "",
  markClassName = "h-8 w-8",
  wordmark = true,
}: {
  className?: string;
  markClassName?: string;
  wordmark?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-ink ${className}`}>
      <LogoMark className={markClassName} />
      {wordmark && (
        <span className="leading-none">
          <span className="block font-display text-xl italic tracking-tight">Embellish</span>
          <span className="block text-[0.6rem] font-semibold tracking-[0.35em] text-ink-soft">
            ANTIQUES
          </span>
        </span>
      )}
    </span>
  );
}
