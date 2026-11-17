import Link from "next/link";
import CaseStudyThumbnail from "@/components/case-study/CaseStudyThumbnail";

// The card sits in a deeper shade of the blue wall, so its logo, and the product's own (mostly
// white) pieces on hover, stand out on it.
const SURFACE = "rgba(0, 22, 105, 0.3)";

export default function CaseStudyPreviewCard({
  slug,
  href,
  title,
  description,
  status,
  years,
  className = "",
}) {
  return (
    <Link
      href={href}
      className={`group relative flex flex-col gap-3 rounded-[16px] hover:z-30 focus-visible:z-30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${className}`}
    >
      {/* The thumbnail draws the card's surface itself, because its label peels out past it. */}
      <div className="relative aspect-[5/4] w-full">
        <CaseStudyThumbnail slug={slug} title={title} surface={SURFACE} />
      </div>

      <div className="flex flex-wrap items-baseline gap-x-2 px-1 text-[15px] font-medium leading-[1.5]">
        <h2 className="text-[#2b2b2b] decoration-1 underline-offset-4 group-hover:underline">
          {title}
        </h2>
        {status && (
          <>
            <span aria-hidden="true" className="text-[#b5b5b5]">
              /
            </span>
            <p className="text-[#6b6b6b]">{years ? `${status} ${years}` : status}</p>
          </>
        )}
        {/* The one-liner stays for screen readers, so the link still says what the project is. */}
        {description && <p className="sr-only">{description}</p>}
      </div>
    </Link>
  );
}
