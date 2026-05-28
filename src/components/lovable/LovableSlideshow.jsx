"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import LovableTimeline from "./LovableTimeline";
import LovableNav from "./LovableNav";

const slideVariants = {
  enter: direction => ({
    x: direction > 0 ? "60%" : "-60%",
    opacity: 0,
    scale: 0.92,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: direction => ({
    x: direction < 0 ? "60%" : "-60%",
    opacity: 0,
    scale: 0.92,
  }),
};

const slideTransition = {
  x: { type: "spring", stiffness: 200, damping: 28 },
  opacity: { duration: 0.35 },
  scale: { duration: 0.35 },
};

export default function LovableSlideshow({ slides, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const isAnimating = useRef(false);
  const lastScrollTime = useRef(0);

  const goTo = useCallback(
    index => {
      if (isAnimating.current) return;
      if (index < 0 || index >= slides.length) return;
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
      isAnimating.current = true;
      setTimeout(() => {
        isAnimating.current = false;
      }, 600);
    },
    [currentIndex, slides.length]
  );

  const goNext = useCallback(() => {
    if (currentIndex < slides.length - 1) goTo(currentIndex + 1);
  }, [currentIndex, slides.length, goTo]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) goTo(currentIndex - 1);
  }, [currentIndex, goTo]);

  // Scroll (wheel) navigation — one slide per gesture with cooldown
  useEffect(() => {
    const COOLDOWN = 800; // ms between allowed slide changes

    const handleWheel = e => {
      e.preventDefault();

      const now = Date.now();
      if (now - lastScrollTime.current < COOLDOWN) return;
      if (isAnimating.current) return;

      // Only trigger on meaningful scroll intent
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 15) return;

      lastScrollTime.current = now;

      if (delta > 0) {
        goNext();
      } else {
        goPrev();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [goNext, goPrev]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  // Touch/swipe navigation
  const touchStart = useRef(null);
  useEffect(() => {
    const handleTouchStart = e => {
      touchStart.current = e.touches[0].clientX;
    };
    const handleTouchEnd = e => {
      if (touchStart.current === null) return;
      const diff = touchStart.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 60) {
        if (diff > 0) goNext();
        else goPrev();
      }
      touchStart.current = null;
    };
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [goNext, goPrev]);

  return (
    <div className="fixed inset-0 flex flex-col bg-white overflow-hidden">
      {/* Exit navigation */}
      <LovableNav title={title} currentIndex={currentIndex} total={slides.length} />

      {/* Main slide area */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="absolute inset-0 flex items-center justify-center px-6 md:px-16 lg:px-24"
          >
            {slides[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Timeline navigation */}
      <LovableTimeline total={slides.length} selectedIndex={currentIndex} scrollTo={goTo} />
    </div>
  );
}
