/**
 * CaseStudyCard
 *
 * Props:
 *  - width: "full" | "half"  (default "full")
 *  - image: string — src for the card image
 *  - imageAlt: string
 *  - children: text / any content placed in the bottom text area
 */
export default function CaseStudyCard({ width = "full", image, imageAlt = "", children }) {
  const isHalf = width === "half";

  return (
    <div
      className={[
        "relative flex flex-col justify-end overflow-hidden rounded-[8px] bg-[#ededed]",
        "h-[640px] w-full",
        isHalf ? "md:flex-1" : "md:w-full",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Image fills the card, sits behind the text strip */}
      {image && (
        <div className="flex flex-grow w-full h-full">
          <img src={image} alt={imageAlt} className="h-full w-full object-contain" />
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
