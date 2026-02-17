import React from "react";
import Link from "next/link";

export default function WipBanner() {
  return (
    <div className="bg-[#1a1a1a] min-h-8 py-1 font-ppmondwest flex flex-col justify-center items-center w-full px-10 md:px-15 lg:px-20 fixed top-0 left-0 z-20">
      <p className="text-white text-[14px] font-ppmondwest text-center">
        Work in progress - Only started building this recently. Stay tuned for updates.
        Strikethrough content is a WIP.
      </p>
    </div>
  );
}
