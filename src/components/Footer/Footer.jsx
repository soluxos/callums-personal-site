import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex w-full flex-col gap-10 pt-10">
      <div className="flex flex-col justify-between gap-10 lg:flex-row">
        <div className="flex flex-1 flex-col gap-10 md:flex-row">
          <div className="w-[223px] flex flex-col">
            <p className="font-ppmondwest text-[20px] leading-none">Side proejcts</p>
            <div className="mt-5 space-y-[14px] text-[14px] font-medium leading-[1.5] text-[#656565] flex flex-col gap-3">
              <p className="text-[14px] font-medium leading-[1.5] underline">Your Next Tale</p>
              <p className="text-[14px] font-medium leading-[1.5] underline">
                Maybe Framer Template
              </p>
              <p className="text-[14px] font-medium leading-[1.5] underline">
                Nifty Framer Template
              </p>
              <p className="text-[14px] font-medium leading-[1.5] underline">
                Crisp Framer Template
              </p>
            </div>
          </div>
          <div className="w-[223px]">
            <p className="font-ppmondwest text-[20px] leading-none">Case studies</p>
            <div className="mt-5 space-y-[14px] text-[14px] font-medium leading-[1.5] text-[#656565] flex flex-col gap-3">
              <p className="flex gap-2 underline">Drupal Canvas</p>
              <p className="flex gap-2 underline">Site Studio</p>
              <p className="flex gap-2 underline">Wzis Store Locator</p>
              <p className="flex gap-2 underline">Union Roasted</p>
              <p className="flex gap-2 underline">Southdowns Unleashed</p>
              <p className="flex gap-2 underline">Bacardi UX</p>
            </div>
          </div>
          <div className="w-[223px]">
            <p className="font-ppmondwest text-[20px] leading-none">Recent blog posts</p>
            <div className="mt-5 space-y-[14px] text-[14px] font-medium leading-[1.5] text-[#656565] flex flex-col gap-3">
              <p className="underline">A blog post</p>
              <p className="underline">Another blog post</p>
              <p className="underline">A fresh post</p>
              <p className="underline">New thoughts</p>
              <p className="underline">More writing</p>
              <p className="underline">Next article</p>
              <p className="underline">Latest post</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Link href="/" className="flex items-end gap-3">
            <span className="text-[16px] text-right font-medium leading-[1.25]">Callum Harrod</span>
          </Link>
          <span className="text-[14px] text-right font-medium leading-none text-[#656565]">
            © 2025 Callum Harrod
          </span>
        </div>
      </div>
    </footer>
  );
}
