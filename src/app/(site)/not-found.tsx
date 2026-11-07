import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="dark-surface relative grid min-h-screen place-items-center overflow-hidden px-5 py-32 text-center">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative max-w-xl">
        <p className="font-heading text-[8rem] font-bold leading-none text-brand sm:text-[11rem]">404</p>
        <h1 className="!text-h2">This page took a wrong turn.</h1>
        <p className="lead mt-4">The page you&apos;re looking for has moved or doesn&apos;t exist. Let&apos;s get you back on track.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/" className="btn-primary">Back to Home <ArrowRight className="h-5 w-5" /></Link><Link href="/contact" className="btn-ghost-dark">Contact Us</Link></div>
      </div>
    </section>
  );
}
