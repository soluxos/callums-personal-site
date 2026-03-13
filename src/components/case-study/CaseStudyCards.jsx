/**
 * CaseStudyCards
 *
 * Wraps one or more <CaseStudyCard> components.
 * - "half" cards sit side-by-side on md+ screens (gap 20px).
 * - "full" cards always span the full row.
 * - On mobile every card is full width regardless of the `width` prop.
 */
export default function CaseStudyCards({ children }) {
  return <div className="flex flex-wrap gap-5 w-full">{children}</div>;
}
