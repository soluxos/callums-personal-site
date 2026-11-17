import Image from "next/image";
import Link from "next/link";
import { CASE_STUDIES } from "@/data/caseStudies";

// The links and the copyright line are white at 66%, like the secondary text in the case study
// heroes, and go full white on hover. `className` sets the space above the footer, which
// depends on the page (see ConditionalFooter).
export default function Footer({ className = "" }) {
  return (
    <footer className={`flex w-full flex-col gap-10 ${className}`}>
      <div className="flex flex-col justify-between gap-10 lg:flex-row">
        <div className="flex flex-1 flex-col gap-10 md:flex-row">
          <div className="w-[223px] flex flex-col">
            <p className="font-ppmondwest text-[20px] leading-none">Side projects</p>
            <div className="mt-5 text-[14px] font-medium leading-[1.5] text-white/[0.66] flex flex-col gap-3">
              <Link
                href="https://yournexttale.com"
                className="text-[14px] font-medium leading-[1.5] hover:text-white"
              >
                Your Next Tale
              </Link>
              <Link
                href="https://maybe.framer.website"
                className="text-[14px] font-medium leading-[1.5] hover:text-white"
              >
                Maybe Framer Template
              </Link>
              <Link
                href="https://nifty.framer.website"
                className="text-[14px] font-medium leading-[1.5] hover:text-white"
              >
                Nifty Framer Template
              </Link>
              <Link
                href="https://crisp.framer.website"
                className="text-[14px] font-medium leading-[1.5] hover:text-white"
              >
                Crisp Framer Template
              </Link>
            </div>
          </div>
          <div className="w-[223px]">
            <p className="font-ppmondwest text-[20px] leading-none">Case studies</p>
            <div className="mt-5 text-[14px] font-medium leading-[1.5] text-white/[0.66] flex flex-col gap-3">
              {CASE_STUDIES.map(cs => (
                <Link key={cs.slug} href={cs.href} className="flex gap-2 hover:text-white">
                  {cs.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="w-[223px]">
            <p className="font-ppmondwest text-[20px] leading-none">Useful links</p>
            <div className="mt-5 text-[14px] font-medium leading-[1.5] text-white/[0.66] flex flex-col gap-3">
              <Link href="https://www.linkedin.com/in/callumharrod/" className="hover:text-white">
                LinkedIn
              </Link>
              <Link href="https://github.com/soluxos" className="hover:text-white">
                GitHub
              </Link>
              <Link href="mailto:callumharrod1994@hotmail.co.uk" className="hover:text-white">
                Get in touch via email
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:items-end gap-5">
          <Link href="/" className="flex md:items-end gap-2">
            <span className="text-[20px] font-ppmondwest leading-[1.25] text-[#484848]">
              Callum Harrod
            </span>
          </Link>
          <span className="text-[14px] md:text-right font-medium leading-none text-white/[0.66]">
            © {new Date().getFullYear()} Callum Harrod
          </span>
        </div>
      </div>
    </footer>
  );
}
