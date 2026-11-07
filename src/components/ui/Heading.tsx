import type { ReactNode } from "react";

export function SectionHead({ eyebrow, title, description, center, as = "h2", className = "" }: { eyebrow?: string; title: ReactNode; description?: ReactNode; center?: boolean; as?: "h1" | "h2"; className?: string }) {
  const H = as;
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow && <p className="eyebrow mb-5" data-reveal>{eyebrow}</p>}
      <H data-split>{title}</H>
      {description && <p className="lead mt-5" data-reveal data-delay="0.1">{description}</p>}
    </div>
  );
}
