// Brand mark: a solid forest-green rounded badge with a bold white "E".
// Mirrors app/icon.svg (the browser-tab favicon) exactly, so update both
// together if this ever changes. Used everywhere a small logo mark is
// needed — header, mobile drawer, footer, admin header, email templates.

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="48" height="48" rx="12" fill="#2F4A3C" />
      <rect x="14" y="13" width="6" height="22" fill="#FFFFFF" />
      <rect x="14" y="13" width="20" height="6" fill="#FFFFFF" />
      <rect x="14" y="21" width="16" height="6" fill="#FFFFFF" />
      <rect x="14" y="29" width="20" height="6" fill="#FFFFFF" />
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
