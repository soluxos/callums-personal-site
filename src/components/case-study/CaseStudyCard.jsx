/**
 * CaseStudyCard
 *
 * Props:
 *  - width: "full" | "half"  (default "full")
 *  - image: string — src for the card image
 *  - imageAlt: string
 *  - children: text / any content placed in the bottom text area
 *  - objectFit: "contain" | "cover" (default "contain")
 */
export default function CaseStudyCard({
  width = "full",
  image,
  imageAlt = "",
  children,
  objectFit = "contain",
}) {
  const isHalf = width === "half";

  return (
    <div
      className={[
        "flex flex-col overflow-hidden rounded-[8px] bg-[#ededed]",
        "h-[400px] md:h-[640px] w-full",
        isHalf ? "md:flex-1" : "md:w-full",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Image fills remaining space above the text strip, inset from the card's edges like
          the slider and image blocks, so it never sits against the grey's sides */}
      {image && (
        <div
          className={`flex-1 min-h-0 w-full overflow-hidden px-5 pt-5 md:px-10 md:pt-10 ${children ? "" : "pb-5 md:pb-10"}`}
        >
          <img src={image} alt={imageAlt} className={`h-full w-full object-${objectFit}`} />
        </div>
      )}

      {/* Text strip at the bottom */}
      {children && (
        <div className="relative z-10 w-full p-5 bg-[#ededed]">
          <p className="text-[14px] font-medium leading-[1.5] text-[#656565]">{children}</p>
        </div>
      )}
    </div>
  );
}
