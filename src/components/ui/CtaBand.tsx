import Link from "next/link";
import { Reveal } from "./Reveal";

export function CtaBand({ title = "Let's Build Something That Moves Your Business Forward.", description = "Have an idea, a challenge, or a digital product in mind? Let's discuss what's possible.", primary = { label: "Start a Project", href: "/contact" }, secondary = { label: "Calculate Project Cost", href: "/website-cost-calculator" } }: {
  title?: string; description?: string; primary?: { label: string; href: string }; secondary?: { label: string; href: string } | null;
}) {
  return (
    <section className="px-5 pb-20 sm:px-8 sm:pb-28">
      <Reveal>
        <div className="dark-surface relative mx-auto max-w-[1300px] overflow-hidden rounded-2xl px-6 py-16 text-center sm:px-14 sm:py-24" style={{ background: "linear-gradient(135deg,#010BCC 0%,#08086F 70%,#101113 100%)" }}>
          <div className="dots pointer-events-none absolute inset-0 opacity-40" aria-hidden />
          <svg className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 opacity-30" viewBox="0 0 200 200" aria-hidden><circle cx="100" cy="100" r="90" fill="none" stroke="#fff" strokeDasharray="3 7" /><circle cx="100" cy="100" r="60" fill="none" stroke="#fff" /><circle cx="100" cy="100" r="30" fill="none" stroke="#fff" strokeDasharray="1 5" /></svg>
          <div className="relative mx-auto max-w-3xl">
            <h2 data-split>{title}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80">{description}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href={primary.href} data-magnetic className="btn bg-white text-brand-deep hover:bg-paper hover:-translate-y-0.5">{primary.label}</Link>
              {secondary && <Link href={secondary.href} data-magnetic className="btn-ghost-dark">{secondary.label}</Link>}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
