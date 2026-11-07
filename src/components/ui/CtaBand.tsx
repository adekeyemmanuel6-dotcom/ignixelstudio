import Link from "next/link";
import { CtaPair } from "./CtaPair";
import { Reveal } from "./Reveal";

export function CtaBand({ title = "Let's Build Something That Moves Your Business Forward.", description = "Have an idea, a challenge, or a digital product in mind? Let's discuss what's possible.", primary = { label: "Start a Project", href: "/contact" }, secondary = { label: "Calculate Project Cost", href: "/website-cost-calculator" } }: {
  title?: string; description?: string; primary?: { label: string; href: string }; secondary?: { label: string; href: string } | null;
}) {
  return (
    <section className="page-x pb-sect">
      <Reveal>
        <div className="dark-surface relative mx-auto max-w-[1300px] overflow-hidden rounded-2xl px-[var(--card-pad)] py-[var(--section-y)] text-center sm:px-14" style={{ background: "linear-gradient(135deg,#010BCC 0%,#08086F 70%,#101113 100%)" }}>
          <div className="dots pointer-events-none absolute inset-0 opacity-40" aria-hidden />
          <svg className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 opacity-30" viewBox="0 0 200 200" aria-hidden><circle cx="100" cy="100" r="90" fill="none" stroke="#fff" strokeDasharray="3 7" /><circle cx="100" cy="100" r="60" fill="none" stroke="#fff" /><circle cx="100" cy="100" r="30" fill="none" stroke="#fff" strokeDasharray="1 5" /></svg>
          <div className="relative mx-auto max-w-3xl">
            <h2 data-split>{title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">{description}</p>
            {secondary ? <CtaPair tone="brand" center primary={primary} secondary={secondary} /> : <div className="cta-gap"><Link href={primary.href} data-magnetic className="btn-white">{primary.label}</Link></div>}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
