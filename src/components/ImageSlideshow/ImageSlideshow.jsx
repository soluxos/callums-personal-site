"use client";

import { useEffect, useState } from "react";

export default function ImageSlideshow({ images, interval = 2500, className = "" }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images, interval]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full object-contain transition-opacity duration-[800ms]"
          style={{ opacity: i === activeIndex ? 1 : 0 }}
        />
      ))}
    </div>
  );
}
