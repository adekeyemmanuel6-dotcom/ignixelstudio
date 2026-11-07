import Link from "next/link";
import type { ReactNode } from "react";

type Cta = { label: ReactNode; href: string };
/**
 * Equal-width, equal-height button pair (see .cta-pair in globals.css). Stacks full-width under 480px.
 * tone: "dark" for dark backgrounds, "light" for white, "brand" for the blue CTA band (white primary).
 */
export function CtaPair({ primary, secondary, tone = "dark", center, heroItem, className = "cta-gap" }: {
  primary: Cta; secondary: Cta; tone?: "dark" | "light" | "brand"; center?: boolean; heroItem?: boolean; className?: string;
}) {
  const p = tone === "brand" ? "btn-white" : "btn-primary";
  const s = tone === "light" ? "btn-secondary" : "btn-secondary-dark";
  return (
    <div className={`cta-pair ${center ? "cta-pair--center" : ""} ${className}`} {...(heroItem ? { "data-hero-item": true } : {})}>
      <Link href={primary.href} className={p} data-magnetic>{primary.label}</Link>
      <Link href={secondary.href} className={s} data-magnetic>{secondary.label}</Link>
    </div>
  );
}
