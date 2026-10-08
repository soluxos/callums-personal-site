/**
 * ZoomableImage
 *
 * A product screen that opens at full size in a new tab, so its detail can be
 * read on a phone or a small card. The image itself is the link: it takes focus
 * from the keyboard, and screen readers hear that it opens full size.
 *
 * Props:
 *  - src, alt:      the image
 *  - className:     classes for the <img>
 *  - linkClassName: classes for the wrapping link (sizing, mostly)
 */
export default function ZoomableImage({ src, alt = "", className = "", linkClassName = "" }) {
  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className={`block cursor-zoom-in rounded-[8px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0090ff] ${linkClassName}`}
    >
      <img src={src} alt={alt} className={className} />
      <span className="sr-only"> (opens full size in a new tab)</span>
    </a>
  );
}
