import { ArrowRight } from "@/components/ui/Ico";
import { CtaPair } from "@/components/ui/CtaPair";

export default function NotFound() {
  return (
    <section className="dark-surface relative grid min-h-screen place-items-center overflow-hidden page-x py-[calc(var(--section-y)+var(--header-h))] text-center">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative max-w-xl">
        <p className="font-heading text-[8rem] font-bold leading-none text-brand sm:text-[11rem]">404</p>
        <h1 className="!text-h2">This page took a wrong turn.</h1>
        <p className="lead mt-4">The page you&apos;re looking for has moved or doesn&apos;t exist. Let&apos;s get you back on track.</p>
        <CtaPair center primary={{ label: <>Back to Home <ArrowRight /></>, href: "/" }} secondary={{ label: "Contact Us", href: "/contact" }} />
      </div>
    </section>
  );
}
