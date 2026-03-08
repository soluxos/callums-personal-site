"use client";

import CaseStudyTableOfContents from "./CaseStudyTableOfContents";

export default function CaseStudyLayout({ sections = [], children }) {
  return (
    <div className="relative flex gap-16 items-start">
      {/* Sticky TOC sidebar */}
      <aside className="hidden xl:block w-[180px] flex-shrink-0 sticky top-15 self-start">
        <CaseStudyTableOfContents sections={sections} />
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
