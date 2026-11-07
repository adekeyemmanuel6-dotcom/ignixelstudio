/* eslint-disable @next/next/no-img-element */
import * as icons from "simple-icons";
import type { Technology } from "@/lib/types";

// Server-only: simple-icons ships official brand glyph paths. Admin-uploaded logos override these.
const byslug = new Map<string, { path: string; hex: string }>();
for (const v of Object.values(icons)) if (v && typeof v === "object" && "slug" in v) byslug.set((v as any).slug, v as any);

export function TechLogo({ tech, size = 40 }: { tech: Pick<Technology, "name" | "icon_slug" | "logo_url" | "color">; size?: number }) {
  if (tech.logo_url) return <img src={tech.logo_url} alt="" width={size} height={size} loading="lazy" className="object-contain" style={{ width: size, height: size }} />;
  const icon = tech.icon_slug ? byslug.get(tech.icon_slug) : undefined;
  if (icon) return <svg role="img" aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill={`#${tech.color || icon.hex}`}><path d={icon.path} /></svg>;
  return (
    <span aria-hidden="true" className="grid place-items-center rounded-xl font-heading font-bold text-white" style={{ width: size, height: size, background: `#${tech.color || "1010E8"}`, fontSize: size * 0.4 }}>
      {tech.name.slice(0, 2)}
    </span>
  );
}
