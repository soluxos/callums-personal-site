import Image from "next/image";
import ImageGrid from "@/components/ImageGrid/SimpleImageGrid";
import Link from "next/link";

export default function Home() {
  // Example usage
  const imageArray = [
    { src: "/images/hero-3.png", alt: "Image 1" },
    { src: "/images/hero-2.png", alt: "Image 2" },
    { src: "/images/hero.png", alt: "Image 3" },
  ];

  return (
    <>
      <main className="flex flex-col gap-[240px]">
        <section className="flex w-full flex-col gap-5">
          <h1 className="w-full max-w-[591px] font-ppmondwest text-[48px] leading-[1.25]">
            My work
          </h1>
          <p className="w-full max-w-[591px] text-[14px] font-medium leading-[1.5] text-[#656565]">
            Well, it's the work I've created case studies for...
          </p>
        </section>
        <section className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="relative h-[540px] w-full overflow-hidden rounded-[16px]">
                <Image
                  src="/images/case-study-placeholders/2.png"
                  alt="The Acquia unification project"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="font-ppmondwest text-[16px] leading-[1.5] text-[#a8a8a8] line-through">
                The Acquia unification project
              </p>
            </div>
            <Link href="/work/acquia-ai" className="flex flex-col gap-2">
              <div className="relative h-[540px] w-full overflow-hidden rounded-[16px]">
                <Image
                  src="/images/case-study-placeholders/1.png"
                  alt="An Acquia AI Project"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="font-ppmondwest text-[16px] leading-[1.5] underline">
                An Acquia AI Project
              </p>
            </Link>
            <Link href="/work/drupal-canvas" className="flex flex-col gap-2">
              <div className="relative h-[540px] w-full overflow-hidden rounded-[16px]">
                <Image
                  src="/images/case-study-placeholders/3.png"
                  alt="Drupal Canvas"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="font-ppmondwest text-[16px] leading-[1.5] underline">Drupal Canvas</p>
            </Link>
            <div className="flex flex-col gap-2">
              <div className="relative h-[540px] w-full overflow-hidden rounded-[16px]">
                <Image
                  src="/images/case-study-placeholders/4.png"
                  alt="Union Roasted Coffee"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="font-ppmondwest text-[16px] leading-[1.5] text-[#a8a8a8] line-through">
                Union Roasted Coffee
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
