import Image from "next/image";
import Link from "next/link";
import { nav, site } from "@/content/site";
import { BookCall } from "./book-call";

export function SiteHeader() {
  return (
    <header>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
        <Link href="/" aria-label={site.name}>
          {/* Lockup min width 140px per brand kit */}
          <Image src="/brand/homaro-lockup-navy.svg" alt={site.name} width={140} height={49} priority />
        </Link>
        <nav className="flex items-center gap-6 text-[15px]">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hidden hover:underline sm:inline">
              {item.label}
            </Link>
          ))}
          <BookCall size="sm" />
        </nav>
      </div>
    </header>
  );
}
