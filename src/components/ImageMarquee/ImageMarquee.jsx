"use client";

export default function ImageMarquee({
  images = [],
  speed = 40,
  imageHeight = 240,
  gap = 16,
  className = "",
}) {
  if (!images.length) return null;

  // Duplicate for seamless loop
  const items = [...images, ...images];

  // Animate by translating exactly 50% (the first copy) for a seamless loop
  const duration = speed;

  return (
    <div
      className={`w-full relative ${className}`}
      style={{ height: imageHeight, overflow: "clip" }}
    >
      <div
        className="flex absolute left-0 top-0"
        style={{
          gap,
          animation: `marquee ${duration}s linear infinite`,
        }}
      >
        {items.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="shrink-0 object-cover rounded-[8px]"
            style={{ width: "auto", height: imageHeight }}
          />
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
