"use client";
import { usePathname } from "next/navigation";
import { MotionConfig } from "motion/react";
import CuttingMat from "@/components/CuttingMat/CuttingMat";

export default function SiteShell({ children }) {
  const pathname = usePathname();
  const isIdeas = pathname.startsWith("/ideas");
  const isHome = pathname === "/";
  return (
    <div
      className={`relative overflow-x-clip font-satoshi text-[#484848]${isIdeas ? "" : " bg-[#f5f5f5]"}`}
    >
      {/* Sits behind the page content, which PageWrapper lifts to z-10. Not on the
          ideas board, which is its own surface. The angle guides only suit the
          homepage; elsewhere they'd land behind body text. */}
      {!isIdeas && <CuttingMat showAngleGuides={isHome} />}
      {/* With reduced motion on, nothing slides or moves in; fades still play. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </div>
  );
}
