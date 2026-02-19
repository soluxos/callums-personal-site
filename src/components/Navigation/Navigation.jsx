"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative flex w-full max-w-[600px] min-w-0 items-center justify-start gap-20">
      <Link href="/" className="flex items-center gap-3">
        <span className="text-[16px] font-medium leading-[1.25] text-[#484848]">Callum Harrod</span>
      </Link>
      <nav className="hidden items-center gap-6 text-[16px] font-medium leading-[24px] text-[#a8a8a8] sm:flex">
        <Link href="/" className="text-[14px] text-[#656565] underline">
          Home
        </Link>
        <Link href="/about" className="text-[14px] text-[#656565] underline">
          About
        </Link>
        <Link href="/work" className="text-[14px] text-[#656565] underline">
          Work
        </Link>
      </nav>
      <button
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(open => !open)}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-[#d9d9d9] text-[#484848] sm:hidden"
      >
        <span className="relative block h-[2px] w-4 bg-current">
          <span className="absolute -top-[6px] left-0 h-[2px] w-4 bg-current" />
          <span className="absolute top-[6px] left-0 h-[2px] w-4 bg-current" />
        </span>
      </button>
      {isOpen ? (
        <div className="absolute right-0 top-[52px] z-10 w-48 rounded-[8px] bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:hidden">
          <div className="flex flex-col gap-3 text-[14px] font-medium text-[#484848]">
            <p onClick={() => setIsOpen(false)}>Home</p>
            <p onClick={() => setIsOpen(false)} className="line-through">
              About
            </p>
            <p onClick={() => setIsOpen(false)} className="line-through">
              Work
            </p>
            <p onClick={() => setIsOpen(false)} className="line-through">
              Projects
            </p>
            <p onClick={() => setIsOpen(false)} className="line-through">
              Feed
            </p>
          </div>
        </div>
      ) : null}
    </header>
  );
}
