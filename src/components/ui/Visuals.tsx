/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { canOptimize } from "@/lib/imageHost";

/** Browser-frame mockup. Uses a real screenshot when provided, otherwise renders a neutral wireframe. */
export function BrowserMockup({ src, alt, tone = "#010BCC", className = "" }: { src?: string | null; alt: string; tone?: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-line bg-paper px-4 py-2.5" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 h-5 flex-1 rounded-full bg-white" />
      </div>
      {src ? (
        <div className="relative aspect-[16/10]"><Image src={src} alt={alt} fill sizes="(max-width:768px) 100vw, 640px" className="object-cover object-top" /></div>
      ) : (
        <div role="img" aria-label={alt} className="aspect-[16/10] p-5" style={{ background: `linear-gradient(135deg, ${tone}14, #fff 60%)` }}>
          <div className="flex items-center justify-between"><span className="h-3 w-16 rounded-full" style={{ background: tone }} /><span className="flex gap-2"><i className="h-2 w-8 rounded-full bg-line" /><i className="h-2 w-8 rounded-full bg-line" /><i className="h-2 w-8 rounded-full bg-line" /></span></div>
          <div className="mt-6 grid grid-cols-5 gap-4">
            <div className="col-span-3 space-y-2.5"><i className="block h-5 w-4/5 rounded bg-text/80" /><i className="block h-5 w-3/5 rounded bg-text/80" /><i className="mt-3 block h-2.5 w-full rounded bg-line" /><i className="block h-2.5 w-5/6 rounded bg-line" /><i className="mt-4 block h-8 w-28 rounded-full" style={{ background: tone }} /></div>
            <div className="col-span-2 rounded-xl" style={{ background: `linear-gradient(160deg, ${tone}, #08086F)` }} />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3"><i className="h-14 rounded-lg bg-white shadow-card" /><i className="h-14 rounded-lg bg-white shadow-card" /><i className="h-14 rounded-lg bg-white shadow-card" /></div>
        </div>
      )}
    </div>
  );
}

export function PhoneMockup({ src, alt, tone = "#010BCC", className = "" }: { src?: string | null; alt: string; tone?: string; className?: string }) {
  return (
    <div className={`w-[34%] overflow-hidden rounded-[1.6rem] border-[5px] border-ink bg-white shadow-2xl ${className}`}>
      {src ? <div className="relative aspect-[9/18]"><Image src={src} alt={alt} fill sizes="160px" className="object-cover object-top" /></div> :
        <div role="img" aria-label={alt} className="aspect-[9/18] p-3" style={{ background: `linear-gradient(180deg, ${tone}22, #fff)` }}>
          <i className="block h-2 w-10 rounded-full" style={{ background: tone }} /><i className="mt-4 block h-3 w-4/5 rounded bg-text/80" /><i className="mt-2 block h-3 w-3/5 rounded bg-text/80" />
          <i className="mt-4 block h-20 rounded-lg" style={{ background: tone }} /><i className="mt-3 block h-2 rounded bg-line" /><i className="mt-2 block h-2 w-4/5 rounded bg-line" />
        </div>}
    </div>
  );
}

/** Portrait/avatar. Remote images go through next/image (resized, modern formats); `className` sizes/positions the wrapper. */
export function Avatar({ name, src, className = "", sizes = "96px" }: { name: string; src?: string | null; className?: string; sizes?: string }) {
  if (src && canOptimize(src)) {
    return <span className={`${/\babsolute\b/.test(className) ? "" : "relative "}block overflow-hidden ${className}`}><Image src={src} alt={name} fill sizes={sizes} className="object-cover object-top" /></span>;
  }
  if (src) return <img src={src} alt={name} loading="lazy" className={`object-cover ${className}`} />;
  return <div aria-hidden className={`grid place-items-center bg-gradient-to-br from-brand to-brand-deep font-heading font-bold text-white ${className}`}>{name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("")}</div>;
}
