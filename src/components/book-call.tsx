import { site } from "@/content/site";
import { ArrowUpRight } from "./icons";

const base =
  "inline-flex items-center gap-2 whitespace-nowrap font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current";

// External scheduling link. "lg" is the page's one coral button (coral is for this button only); "sm" is the quiet header version.
export function BookCall({ size = "lg" }: { size?: "lg" | "sm" }) {
  const look =
    size === "lg"
      ? "h-12 rounded-[8px] bg-coral px-5 text-navy hover:bg-[#ee7765]"
      : "h-9 rounded-[6px] bg-navy px-4 text-[15px] text-paper hover:bg-navy-raised";
  return (
    <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className={`${base} ${look}`}>
      Book a call <ArrowUpRight />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
