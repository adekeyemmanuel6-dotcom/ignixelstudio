import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function SectionHead({ eyebrow, title, description, center, as = "h2", className = "" }: { eyebrow?: string; title: ReactNode; description?: ReactNode; center?: boolean; as?: "h1" | "h2"; className?: string }) {
  const H = as;
  return (
    <Reveal className={`${center ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <H>{title}</H>
      {description && <p className="lead mt-5">{description}</p>}
    </Reveal>
  );
}
