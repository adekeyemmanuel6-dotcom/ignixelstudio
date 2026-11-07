"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { TeamMember } from "@/lib/types";
import { Avatar } from "@/components/ui/Visuals";
import { Ico, Globe } from "@/components/ui/Ico";
import { Social } from "@/components/ui/Social";

/**
 * Team showcase: 4 portrait cards per row on laptop/desktop (≥1024), 2 on tablet (768–1023), 1 on mobile.
 * Each card is one accessible button; activating it opens a profile dialog with the member's real details.
 */
export function TeamGrid({ members }: { members: TeamMember[] }) {
  const [active, setActive] = useState<TeamMember | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const open = (m: TeamMember) => { opener.current = document.activeElement as HTMLElement; setActive(m); };
  const close = useCallback(() => { setActive(null); opener.current?.focus(); }, []);

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-6" data-stagger>
        {members.map((m) => (
          <li key={m.id} className="min-w-0">
            <article className="group relative h-full rounded-2xl bg-[#EEF0F4] p-2 transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_28px_50px_-24px_rgba(16,24,40,.45)] motion-reduce:transform-none motion-reduce:transition-none">
              <button type="button" onClick={() => open(m)} aria-haspopup="dialog" aria-label={`View profile: ${m.full_name}, ${m.job_title}`}
                className="relative block aspect-[3/4] w-full overflow-hidden rounded-xl bg-ink-2 text-left focus-visible:outline-offset-4">
                <Avatar name={m.full_name} src={m.photo_url}
                  sizes="(min-width:1024px) 25vw, (min-width:768px) 50vw, 100vw" className="absolute inset-0 h-full w-full text-6xl transition-[transform,filter] duration-500 ease-out [filter:grayscale(.85)_contrast(1.04)] group-hover:scale-[1.04] group-hover:[filter:grayscale(0)_contrast(1)] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
                <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute inset-x-0 bottom-0 block p-4 pr-16 sm:p-5 sm:pr-16">
                  <span className="block font-heading text-xl font-semibold leading-tight text-white sm:text-[1.4rem]">{m.full_name}</span>
                  <span className="mt-1 block text-base leading-snug text-white/80">{m.job_title}</span>
                </span>
                <span aria-hidden className="absolute bottom-3.5 right-3.5 grid h-9 w-9 place-items-center rounded-full bg-white text-ink shadow-[0_6px_16px_rgba(0,0,0,.35)] transition duration-300 ease-out group-hover:rotate-90 group-hover:scale-110 group-hover:bg-brand group-hover:text-white motion-reduce:transition-none motion-reduce:group-hover:rotate-0">
                  <Ico name="add" className="h-5 w-5" />
                </span>
              </button>
            </article>
          </li>
        ))}
      </ul>
      {active && <ProfileDialog m={active} onClose={close} />}
    </>
  );
}

function ProfileDialog({ m, onClose }: { m: TeamMember; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !panel.current) return;
      const f = panel.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled])');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", key);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", key); };
  }, [mounted, onClose]);
  if (!mounted) return null;

  const links = [[m.linkedin_url, "linkedin", "LinkedIn"], [m.twitter_url, "x", "X"], [m.website_url, "web", "Website"]] as const;
  const first = m.full_name.split(/\s+/)[0];
  return createPortal(
    <div className="team-dialog fixed inset-0 z-[110] grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:p-8" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={panel} role="dialog" aria-modal="true" aria-labelledby="team-dialog-name" className="team-dialog-panel relative grid w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-[300px_minmax(0,1fr)]">
        <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close profile" className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-ink shadow transition hover:bg-brand hover:text-white md:bg-paper">
          <Ico name="close" className="h-6 w-6" />
        </button>
        <div className="relative aspect-[4/3] bg-ink-2 md:aspect-auto md:min-h-[420px]">
          <Avatar name={m.full_name} src={m.photo_url} sizes="(min-width:768px) 300px, 100vw" className="absolute inset-0 h-full w-full text-7xl" />
        </div>
        <div className="flex flex-col p-6 sm:p-8">
          <p className="eyebrow">{m.category}</p>
          <h3 id="team-dialog-name" className="mt-3 !text-3xl !leading-tight">{m.full_name}</h3>
          <p className="mt-1 text-lg font-medium text-brand">{m.job_title}</p>
          <div className="mt-5 text-text-2">
            {m.bio ? <p className="whitespace-pre-line">{m.bio}</p> : <p>{first} is part of the Ignixel Studio {m.category.toLowerCase()} team.</p>}
          </div>
          {links.some(([u]) => u) && (
            <ul className="mt-5 flex gap-2" aria-label={`${m.full_name} on social media`}>
              {links.filter(([u]) => u).map(([u, k, n]) => (
                <li key={n}><a href={u!} target="_blank" rel="noopener noreferrer" aria-label={`${m.full_name} on ${n}`} className="grid h-11 w-11 place-items-center rounded-[5px] border border-line text-text transition hover:border-brand hover:text-brand">{k === "web" ? <Globe className="h-5 w-5" /> : <Social name={k} />}</a></li>
              ))}
            </ul>
          )}
          <div className="mt-auto pt-7"><Link href="/contact" onClick={onClose} className="btn-primary w-full sm:w-auto">Work with {first}</Link></div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
