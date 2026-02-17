import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex w-full flex-col gap-10 pt-10">
      <div className="flex flex-col justify-between gap-10 lg:flex-row">
        <div className="flex flex-1 flex-col gap-10 md:flex-row">
          <div className="w-[223px]">
            <p className="font-ppmondwest text-[20px] leading-none">Side proejcts</p>
            <p className="mt-5 text-[14px] font-medium leading-[1.5] text-[#a8a8a8] line-through">
              Your Next Tale
            </p>
            <p className="mt-5 text-[14px] font-medium leading-[1.5] text-[#a8a8a8] line-through">
              Maybe Framer Template
            </p>
            <p className="mt-5 text-[14px] font-medium leading-[1.5] text-[#a8a8a8] line-through">
              Nifty Framer Template
            </p>
            <p className="mt-5 text-[14px] font-medium leading-[1.5] text-[#a8a8a8] line-through">
              Crisp Framer Template
            </p>
          </div>
          <div className="w-[223px]">
            <p className="font-ppmondwest text-[20px] leading-none">Case studies</p>
            <div className="mt-5 space-y-[14px] text-[14px] font-medium leading-[1.5] text-[#656565]">
              <p className="flex gap-2">
                <span className="text-[#a8a8a8] line-through">Drupal Canvas</span>
              </p>
              <p className="flex gap-2">
                <span className="text-[#a8a8a8] line-through">Site Studio</span>
              </p>
              <p className="flex gap-2">
                <span className="text-[#a8a8a8] line-through">Wzis Store Locator</span>
              </p>
              <p className="flex gap-2">
                <span className="text-[#a8a8a8] line-through">Union Roasted</span>
              </p>
              <p className="flex gap-2">
                <span className="text-[#a8a8a8] line-through">Southdowns Unleashed</span>
              </p>
              <p className="flex gap-2">
                <span className="text-[#a8a8a8] line-through">Bacardi UX</span>
              </p>
            </div>
          </div>
          <div className="w-[223px]">
            <p className="font-ppmondwest text-[20px] leading-none">Recent blog posts</p>
            <div className="mt-5 space-y-[14px] text-[14px] font-medium leading-[1.5] text-[#a8a8a8]">
              <p className="line-through">A blog post</p>
              <p className="line-through">Another blog post</p>
              <p className="line-through">A fresh post</p>
              <p className="line-through">New thoughts</p>
              <p className="line-through">More writing</p>
              <p className="line-through">Next article</p>
              <p className="line-through">Latest post</p>
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
