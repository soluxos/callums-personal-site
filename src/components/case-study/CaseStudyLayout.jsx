"use client";

import CaseStudyTableOfContents from "./CaseStudyTableOfContents";

export default function CaseStudyLayout({ sections = [], children }) {
  return (
    <>
      {/* TOC is self-contained with fixed positioning */}
      <CaseStudyTableOfContents sections={sections} />
      {/* Extra bottom padding so content isn't obscured by the fixed bar */}
      <div className="pb-20">{children}</div>
    </>
  );
}
