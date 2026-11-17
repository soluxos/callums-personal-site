"use client";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/ideas")) return null;
  // The footer has 160px above and below it on desktop (96px on phones), like the case study
  // heroes. The space below is the page wrapper's padding, and so is the space above on most
  // pages (its gap). A case study ends 160px above the footer on desktop but only 80px on
  // phones, so there the footer adds the difference.
  const caseStudy = /^\/case-studies\/.+/.test(pathname);
  return <Footer className={caseStudy ? "mt-4 md:mt-0" : ""} />;
}
