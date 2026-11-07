/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { canOptimize } from "@/lib/imageHost";
// Official Ignixel mark (public/brand/ignixel-mark.svg), drawn inline so it stays crisp and recolour-free.
// An uploaded logo in Admin → Settings overrides it everywhere (header, footer, admin).
export function Logo({ url, dark = false, className = "h-9", priority = false }: { url?: string; dark?: boolean; className?: string; priority?: boolean }) {
  // An uploaded logo may be a huge original (1600px+). Serve a resized copy; fall back to <img> for non-allow-listed hosts.
  if (url && canOptimize(url)) return <Image src={url} alt="Ignixel Studio" width={96} height={96} sizes="96px" priority={priority} className={`${className} w-auto`} />;
  if (url) return <img src={url} alt="Ignixel Studio" className={`${className} w-auto`} />;
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Ignixel Studio">
      <svg viewBox="0 0 1668 1668" className="h-full w-auto" aria-hidden="true">
        <rect width="1668" height="1668" rx="97" fill="#010BCC" />
        <g fill="#fff"><rect x="484" y="463" width="173" height="173" /><rect x="1014" y="463" width="173" height="173" /><rect x="657" y="636" width="357" height="357" /><rect x="480" y="996" width="173" height="173" /><rect x="1014" y="993" width="173" height="173" /></g>
        <g fill="#010BCC"><polygon points="827,723 827,775 760,816 827,855 827,907 712,836 712,795" /><polygon points="850,723 850,775 917,816 850,855 850,907 965,836 965,795" /></g>
      </svg>
      <span className={`font-heading text-[1.35rem] font-semibold leading-none tracking-tight ${dark ? "text-white" : "text-text"}`}>
        Ignixel<span className={dark ? "text-[#8b8bff]" : "text-brand"}> Studio</span>
      </span>
    </span>
  );
}
