"use client";

import { useEffect, useRef, useState } from "react";
import { slugify } from "./CaseStudySection";

function normalise(section) {
  if (typeof section === "string") return { label: section, id: slugify(section) };
  return section;
}

export default function CaseStudyTableOfContents({ sections = [] }) {
  const [activeId, setActiveId] = useState(null);
  const observerRef = useRef(null);

  const items = sections.map(normalise);

  useEffect(() => {
    if (!items.length) return;

    observerRef.current = new IntersectionObserver(
      entries => {
        // Find the topmost visible section
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-10% 0px -70% 0px",
        threshold: 0,
      }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [sections]);

  function handleClick(e, id) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  }

  if (!items.length) return null;

  return (
    <nav aria-label="Table of contents" className="flex flex-col gap-1">
      {items.map(({ label, id }) => {
        const isActive = activeId === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            onClick={e => handleClick(e, id)}
            className={`group flex items-center gap-2.5 py-1 text-[13px] font-medium leading-[1.4] transition-colors duration-150 ${
              isActive ? "text-[#484848]" : "text-[#a8a8a8] hover:text-[#656565]"
            }`}
          >
            <span
              className={`rounded-full flex-shrink-0 transition-all duration-200 ${
                isActive
                  ? "w-1.5 h-1.5 bg-[#484848]"
                  : "w-1 h-1 bg-[#d4d4d4] group-hover:bg-[#a8a8a8]"
              }`}
            />
            {label}
          </a>
        );
      })}
    </nav>
  );
}
