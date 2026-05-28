"use client";
import { usePathname } from "next/navigation";

export default function PageWrapper({ children }) {
  const pathname = usePathname();
  const isIdeas = pathname.startsWith("/ideas");
  const isLovable = pathname.startsWith("/lovable");
  const isCaseStudyInner = /^\/case-studies\/.+/.test(pathname);

  if (isLovable) {
    return <div className="relative z-10">{children}</div>;
  }

  return (
    <div
      className={`flex w-full max-w-[1440px] flex-col mx-auto relative z-10 ${isIdeas ? "" : " pb-20 sm:pb-[160px]"}`}
    >
      <div
        className={`mx-5 sm:mx-10 flex flex-col ${
          isIdeas ? "pt-8 gap-4" : isCaseStudyInner ? "pt-8 gap-0" : "pt-8 gap-30 sm:gap-[240px]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
