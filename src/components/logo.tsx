// Brand mark: a solid forest-green rounded badge with a serif "E" (Times
// New Roman / Georgia — a normal weight, not bold, to fit the antiques
// brand rather than a chunky blocky mark). Mirrors app/icon.svg (the
// browser-tab favicon) exactly, so update both together if this ever
// changes. Used everywhere a small logo mark is needed — header, mobile
// drawer, footer, admin header, email templates.

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="48" height="48" rx="12" fill="#2F4A3C" />
      <text
        x="24"
        y="25"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Georgia, 'Times New Roman', Times, serif"
        fontSize="30"
        fontWeight="500"
        fill="#FFFFFF"
      >
        E
      </text>
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
          <span className="block font-display text-xl tracking-tight">Embellish</span>
          <span className="block text-[0.6rem] font-semibold tracking-[0.35em] text-ink-soft">
            ANTIQUES
          </span>
        </span>
      )}
    </span>
  );
}
