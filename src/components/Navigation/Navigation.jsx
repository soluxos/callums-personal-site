"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  // Links are quiet (66% white on the wall) and the page you are on is full white.
  const link = href =>
    `text-[14px] hover:text-[#484848] ${
      (href === "/" ? pathname === "/" : pathname.startsWith(href))
        ? "text-[#484848]"
        : "text-[#6b6b6b]"
    }`;

  return (
    <header
      className="relative flex w-full max-w-[1360px] min-w-0 items-center justify-between gap-20"
      style={{ zIndex: 200, position: "relative" }}
    >
      <Link href="/" className="flex items-center gap-3">
        <span className="text-[20px] font-ppmondwest leading-[1.25] text-[#484848]">
          Callum Harrod
        </span>
      </Link>
      <nav className="hidden items-center gap-6 text-[16px] font-medium leading-[24px] sm:flex">
        <Link href="/" className={link("/")}>
          Home
        </Link>
        <Link href="/about" className={link("/about")}>
          About
        </Link>
        <Link href="/case-studies" className={link("/case-studies")}>
          Case studies
        </Link>
        <Link href="/ideas" className={link("/ideas")}>
          Ideas
        </Link>
      </nav>
      <button
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(open => !open)}
        className="flex h-8 w-8 items-center justify-center rounded-md ml-auto sm:hidden text-[#484848]"
      >
        <span className="relative block h-[2px] w-4 bg-current">
          <span className="absolute -top-[6px] left-0 h-[2px] w-4 bg-current" />
          <span className="absolute top-[6px] left-0 h-[2px] w-4 bg-current" />
        </span>
      </button>
      {isOpen ? (
        <div className="absolute right-0 top-[52px] z-10 w-48 rounded-[8px] bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:hidden">
          <div className="flex flex-col gap-3 text-[14px] font-medium text-[#484848]">
            <Link onClick={() => setIsOpen(false)} href="/" className={link("/")}>
              Home
            </Link>
            <Link onClick={() => setIsOpen(false)} href="/about" className={link("/about")}>
              About
            </Link>
            <Link
              onClick={() => setIsOpen(false)}
              href="/case-studies"
              className={link("/case-studies")}
            >
              Case studies
            </Link>
            <Link onClick={() => setIsOpen(false)} href="/ideas" className={link("/ideas")}>
              Ideas
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
