"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

// Starts every page at the top. It runs before the new page is painted, so the page never
// shows for a frame at the last page's scroll position. The fade itself is in template.js.
export default function PageTransition({ children }) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return children;
}
