"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  // Every case study opens with a dark gradient hero, gated or not.
  const isWhite = /^\/case-studies\/.+/.test(pathname);

  return (
    <header
      className="relative flex w-full max-w-[1360px] min-w-0 items-center justify-between gap-20"
      style={{ zIndex: 200, position: "relative" }}
    >
      <Link href="/" className="flex items-center gap-3">
        <span
          className={`text-[20px] font-ppmondwest font-medium leading-[1.25] ${isWhite ? "text-white" : "text-[#484848]"}`}
        >
          Callum Harrod
        </span>
      </Link>
      <nav className="hidden items-center gap-6 text-[16px] font-medium leading-[24px] sm:flex">
        <Link
          href="/"
          className={`text-[14px] ${isWhite ? "text-white/70 hover:text-white" : "text-[#6b6b6b] hover:text-[#484848]"}`}
        >
          Home
        </Link>
        <Link
          href="/about"
          className={`text-[14px] ${isWhite ? "text-white/70 hover:text-white" : "text-[#6b6b6b] hover:text-[#484848]"}`}
        >
          About
        </Link>
        <Link
          href="/case-studies"
          className={`text-[14px] ${isWhite ? "text-white/70 hover:text-white" : "text-[#6b6b6b] hover:text-[#484848]"}`}
        >
          Case studies
        </Link>
        <Link
          href="/ideas"
          className={`text-[14px] ${isWhite ? "text-white/70 hover:text-white" : "text-[#6b6b6b] hover:text-[#484848]"}`}
        >
          Ideas
        </Link>
      </nav>
      <button
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(open => !open)}
        className={`flex h-8 w-8 items-center justify-center rounded-md ml-auto sm:hidden ${isWhite ? "text-white" : "text-[#484848]"}`}
      >
        <span className="relative block h-[2px] w-4 bg-current">
          <span className="absolute -top-[6px] left-0 h-[2px] w-4 bg-current" />
          <span className="absolute top-[6px] left-0 h-[2px] w-4 bg-current" />
        </span>
      </button>
      {isOpen ? (
        <div className="absolute right-0 top-[52px] z-10 w-48 rounded-[8px] bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:hidden">
          <div className="flex flex-col gap-3 text-[14px] font-medium text-[#484848]">
            <Link
              onClick={() => setIsOpen(false)}
              href="/"
              className="text-[14px] text-[#6b6b6b] hover:text-[#484848]"
            >
              Home
            </Link>
            <Link
              onClick={() => setIsOpen(false)}
              href="/about"
              className="text-[14px] text-[#6b6b6b] hover:text-[#484848]"
            >
              About
            </Link>
            <Link
              onClick={() => setIsOpen(false)}
              href="/case-studies"
              className="text-[14px] text-[#6b6b6b] hover:text-[#484848]"
            >
              Case studies
            </Link>
            <Link
              onClick={() => setIsOpen(false)}
              href="/ideas"
              className="text-[14px] text-[#6b6b6b] hover:text-[#484848]"
            >
              Ideas
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
