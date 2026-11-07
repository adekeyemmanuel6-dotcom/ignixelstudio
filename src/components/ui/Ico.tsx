import { ICON_PATHS } from "@/lib/icons.generated";

type P = { className?: string };
/** Google Material Symbols (Rounded) rendered as inline SVG: no icon font, no extra request. */
export function Ico({ name, className = "h-5 w-5" }: { name: keyof typeof ICON_PATHS | string; className?: string }) {
  const d = ICON_PATHS[name] ?? ICON_PATHS.star;
  return <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" focusable="false" className={`shrink-0 ${className}`}><path d={d} /></svg>;
}
const mk = (name: string, def = "h-5 w-5") => function Shim({ className = def }: P) { return <Ico name={name} className={className} />; };

// Drop-in names so existing components keep their JSX but render Material icons.
export const ArrowRight = mk("arrow_forward");
export const ArrowLeft = mk("arrow_back");
export const ArrowUpRight = mk("arrow_outward");
export const ChevronDown = mk("keyboard_arrow_down");
export const Menu = mk("menu", "h-6 w-6");
export const X = mk("close", "h-6 w-6");
export const Check = mk("check");
export const CheckCircle2 = mk("check_circle");
export const Mail = mk("mail");
export const Phone = mk("call");
export const MapPin = mk("location_on");
export const Quote = mk("format_quote");
export const Globe = mk("language");
export const Download = mk("download");
export const Search = mk("search");
