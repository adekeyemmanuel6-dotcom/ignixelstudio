"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BarChart3, BookOpen, Calculator, ExternalLink, FileText, Home, Inbox, Layers, LogOut, Mail, Menu, MessageSquareQuote, Settings, Tags, Users, Wrench, X, Briefcase, Folder } from "lucide-react";
import { AdminProvider, useAdmin } from "@/lib/admin/ctx";
import { Logo } from "@/components/Logo";

const NAV = [
  { group: "Overview", items: [["/admin", "Dashboard", BarChart3], ["/admin/leads", "Leads", Inbox], ["/admin/newsletter", "Newsletter", Mail]] },
  { group: "Content", items: [["/admin/homepage", "Homepage", Home], ["/admin/service-categories", "Service Categories", Layers], ["/admin/services", "Services", Wrench], ["/admin/projects", "Projects", Briefcase], ["/admin/team", "Team", Users], ["/admin/testimonials", "Testimonials", MessageSquareQuote], ["/admin/technologies", "Technologies", Folder], ["/admin/pages", "About & Legal", FileText]] },
  { group: "Blog", items: [["/admin/blog", "Articles", BookOpen], ["/admin/blog-categories", "Categories", Folder], ["/admin/blog-tags", "Tags", Tags]] },
  { group: "Tools", items: [["/admin/calculator", "Calculator", Calculator], ["/admin/settings", "Settings", Settings]] },
] as const;

function Inner({ children }: { children: React.ReactNode }) {
  const path = usePathname(); const router = useRouter(); const { db, email, role } = useAdmin(); const [open, setOpen] = useState(false);
  const signOut = async () => { await db.auth.signOut(); router.replace("/admin/login"); router.refresh(); };
  const nav = (
    <nav aria-label="Admin" className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
      {NAV.map((g) => (
        <div key={g.group}><p className="px-3 pb-2 text-base font-semibold uppercase tracking-wider text-white/40">{g.group}</p>
          {g.items.map(([href, label, Ic]) => { const active = href === "/admin" ? path === href : path.startsWith(href); return (
            <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition ${active ? "bg-brand text-white" : "text-white/75 hover:bg-white/10 hover:text-white"}`}><Ic className="h-5 w-5" />{label}</Link>); })}
        </div>
      ))}
    </nav>
  );
  return (
    <div className="lg:grid lg:grid-cols-[272px_1fr]">
      <aside className="hidden h-screen flex-col bg-ink lg:sticky lg:top-0 lg:flex">
        <div className="p-5"><Logo dark className="h-9" /></div>{nav}
        <div className="border-t border-white/10 p-4 text-white/70"><p className="truncate">{email}</p><p className="capitalize text-white/50">{role}</p>
          <div className="mt-3 flex gap-2"><Link href="/" target="_blank" className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg border border-white/15 hover:bg-white/10"><ExternalLink className="h-4 w-4" /> Site</Link><button onClick={signOut} className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg border border-white/15 hover:bg-white/10"><LogOut className="h-4 w-4" /> Sign out</button></div></div>
      </aside>
      <div className="min-w-0">
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white px-4 py-2 lg:hidden"><Logo className="h-8" /><button aria-label="Open menu" onClick={() => setOpen(true)} className="grid h-11 w-11 place-items-center"><Menu /></button></div>
        {open && <div className="fixed inset-0 z-50 flex flex-col bg-ink lg:hidden"><div className="flex items-center justify-between p-4"><Logo dark className="h-8" /><button aria-label="Close menu" onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center text-white"><X /></button></div>{nav}<div className="border-t border-white/10 p-4"><button onClick={signOut} className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-white/15 text-white"><LogOut className="h-4 w-4" /> Sign out</button></div></div>}
        <main className="mx-auto max-w-6xl p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
export function AdminShell({ role, email, children }: { role: "admin" | "editor"; email: string; children: React.ReactNode }) {
  return <AdminProvider role={role} email={email}><Inner>{children}</Inner></AdminProvider>;
}
