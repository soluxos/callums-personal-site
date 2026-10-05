import Image from "next/image";
import Link from "next/link";
import { CASE_STUDIES } from "@/data/caseStudies";

export default function Footer() {
  return (
    <footer className="flex w-full flex-col gap-10">
      <div className="flex flex-col justify-between gap-10 lg:flex-row">
        <div className="flex flex-1 flex-col gap-10 md:flex-row">
          <div className="w-[223px] flex flex-col">
            <p className="font-ppmondwest text-[20px] leading-none">Side projects</p>
            <div className="mt-5 space-y-[14px] text-[14px] font-medium leading-[1.5] text-[#6b6b6b] flex flex-col gap-3">
              <Link
                href="https://yournexttale.com"
                className="text-[14px] font-medium leading-[1.5] hover:text-[#484848]"
              >
                Your Next Tale
              </Link>
              <Link
                href="https://maybe.framer.website"
                className="text-[14px] font-medium leading-[1.5] hover:text-[#484848]"
              >
                Maybe Framer Template
              </Link>
              <Link
                href="https://nifty.framer.website"
                className="text-[14px] font-medium leading-[1.5] hover:text-[#484848]"
              >
                Nifty Framer Template
              </Link>
              <Link
                href="https://crisp.framer.website"
                className="text-[14px] font-medium leading-[1.5] hover:text-[#484848]"
              >
                Crisp Framer Template
              </Link>
            </div>
          </div>
          <div className="w-[223px]">
            <p className="font-ppmondwest text-[20px] leading-none">Case studies</p>
            <div className="mt-5 space-y-[14px] text-[14px] font-medium leading-[1.5] text-[#6b6b6b] flex flex-col gap-3">
              {CASE_STUDIES.map(cs => (
                <Link key={cs.slug} href={cs.href} className="flex gap-2 hover:text-[#484848]">
                  {cs.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="w-[223px]">
            <p className="font-ppmondwest text-[20px] leading-none">Useful links</p>
            <div className="mt-5 space-y-[14px] text-[14px] font-medium leading-[1.5] text-[#6b6b6b] flex flex-col gap-3">
              <Link
                href="https://www.linkedin.com/in/callumharrod/"
                className="hover:text-[#484848]"
              >
                LinkedIn
              </Link>
              <Link href="https://github.com/soluxos" className="hover:text-[#484848]">
                Github
              </Link>
              <Link href="mailto:callumharrod1994@hotmail.co.uk" className="hover:text-[#484848]">
                Get in touch via email
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:items-end gap-5">
          <Link href="/" className="flex md:items-end gap-2">
            <span className="text-[20px] font-ppmondwest font-medium leading-[1.25] text-[#484848]">
              Callum Harrod
            </span>
          </Link>
          <span className="text-[14px] md:text-right font-medium leading-none text-[#6b6b6b]">
            © {new Date().getFullYear()} Callum Harrod
          </span>
        </div>
      </div>
    </footer>
  );
}
