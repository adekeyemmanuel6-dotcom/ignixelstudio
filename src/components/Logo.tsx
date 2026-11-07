/* eslint-disable @next/next/no-img-element */
// Brand mark. If an official logo URL is set in Admin → Settings (or /public/brand/logo.svg is uploaded
// there), it is rendered untouched. Until then a placeholder wordmark is shown — replace it with the official asset.
export function Logo({ url, dark = false, className = "h-9" }: { url?: string; dark?: boolean; className?: string }) {
  if (url) return <img src={url} alt="Ignixel Studio" className={`${className} w-auto`} />;
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Ignixel Studio">
      <svg viewBox="0 0 40 40" className="h-full w-auto" aria-hidden="true">
        <rect width="40" height="40" rx="11" fill="#1010E8" />
        <path d="M13 11h6v18h-6zM21 11h6l-6 9 6 9h-6l-6-9z" fill="#fff" />
      </svg>
      <span className={`font-heading text-[1.35rem] font-semibold leading-none tracking-tight ${dark ? "text-white" : "text-text"}`}>
        Ignixel<span className={dark ? "text-[#8b8bff]" : "text-brand"}> Studio</span>
      </span>
    </span>
  );
}
