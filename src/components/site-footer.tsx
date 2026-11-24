import Image from "next/image";
import Link from "next/link";
import { nav, site } from "@/content/site";
import { BookCall } from "@/components/book-call";

export function SiteFooter() {
  return (
    <footer className="bg-navy text-paper">
      {/* Closing CTA on every page: the page's bright moment is this button on navy */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-20 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-7">
          <h2 className="text-3xl leading-[1.15] font-medium tracking-[-0.02em] sm:text-5xl">
            See what Homaro can verify on your robots.
          </h2>
          <p className="mt-6 max-w-xl text-lg text-mist">
            Bring a robot task, its available data and a known outcome. We&apos;ll explore what Homaro can
            independently verify.
          </p>
        </div>
        <div className="lg:col-span-5 lg:self-end lg:justify-self-end">
          <BookCall />
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 border-t border-paper/10 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        <Image src="/brand/homaro-lockup-white.svg" alt={site.name} width={140} height={49} />
        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-mist">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-paper">{item.label}</Link>
          ))}
          <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="hover:text-paper">Book a call</a>
          <a href={`mailto:${site.contactEmail}`} className="hover:text-paper">{site.contactEmail}</a>
        </nav>
      </div>
    </footer>
  );
}
