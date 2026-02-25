import Image from "next/image";
import ImageGrid from "@/components/ImageGrid/SimpleImageGrid";
import Link from "next/link";
import DitherBackground from "@/components/DitherBackground/DitherBackground";
import ImageSlideshow from "@/components/ImageSlideshow/ImageSlideshow";
import ImageMarquee from "@/components/ImageMarquee/ImageMarquee";

export default function Home() {
  // Example usage
  const imageArray = [
    { src: "/images/hero-3.png", alt: "Image 1" },
    { src: "/images/hero-2.png", alt: "Image 2" },
    { src: "/images/hero.png", alt: "Image 3" },
  ];

  return (
    <>
      <main className="flex flex-col gap-[80px]">
        <section className="flex w-full flex-col gap-5">
          <h1 className="w-full max-w-[591px] font-ppmondwest text-[48px] leading-[1.25]">
            Case studies
          </h1>
          <p className="w-full max-w-[591px] text-[14px] font-medium leading-[1.5] text-[#656565]">
            A short selection of some projects I've worked on...
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/case-studies/drupal-canvas" className="flex flex-col gap-2 md:col-span-2">
              <div className="relative h-[540px] w-full overflow-hidden rounded-[16px] bg-[#EDEDED]">
                {/* <ImageSlideshow
                images={[
                  "/images/case-studies/drupal-canvas/drupal-canvas-hero.png",
                  "/images/case-studies/drupal-canvas/cms-content.png",
                  "/images/case-studies/drupal-canvas/content-canvas.png",
                  "/images/case-studies/drupal-canvas/design-system.png",
                  "/images/case-studies/drupal-canvas/code-editor.png",
                  "/images/case-studies/drupal-canvas/user-flows.png",
                ]}
                interval={2500}
                className="absolute bottom-40 left-20 z-0"
              /> */}
                <div className="h-full w-full flex flex-col items-center justify-center pb-30">
                  <ImageMarquee
                    images={[
                      "/images/case-studies/drupal-canvas/drupal-canvas-hero.png",
                      "/images/case-studies/drupal-canvas/cms-content.png",
                      "/images/case-studies/drupal-canvas/content-canvas.png",
                      "/images/case-studies/drupal-canvas/design-system.png",
                      "/images/case-studies/drupal-canvas/code-editor.png",
                      "/images/case-studies/drupal-canvas/user-flows.png",
                    ]}
                    speed={40} // pixels per second
                    imageWidth={600} // px
                    imageHeight={360} // px
                    gap={16} // px between images
                    className="w-full max-w-full"
                  />
                </div>
                <DitherBackground
                  className="h-full w-full bg-[#19191928] bg-linear-180 transition-colors"
                  dotColor="#bbbbbb"
                  pixelSize={1}
                  cellMultiplier={2}
                  waveSpeed={0.2}
                  ringThickness={1}
                  waveProfile="gaussian"
                  waveShape="circle"
                />
                <div className="absolute z-10 bottom-5 left-5 w-[calc(100%-2.5rem)] flex flex-col gap-2">
                  <p className="font-satoshi font-bold uppercase text-[10px] leading-[1.5] bg-white text-[#656565] px-2 rounded-full self-start">
                    Public
                  </p>
                  <div className="flex flex-col gap-0">
                    <p className="font-satoshi text-[16px] text-[#656565]">Drupal Canvas</p>
                    <p className="font-ppmondwest text-[32px] leading-[1.5] text-[#656565]">
                      How I designed and helped ship the future of building and editing websites
                      with Drupal
                    </p>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/case-studies/acquia-unification" className="flex flex-col gap-2">
              <div className="relative h-[540px] w-full overflow-hidden rounded-[16px] bg-[#2e2e2e]">
                <DitherBackground
                  className="h-full w-full"
                  dotColor="#484848"
                  pixelSize={1}
                  cellMultiplier={1}
                  waveSpeed={0.4}
                  ringThickness={0.5}
                  waveProfile="gaussian"
                  waveShape="diamond"
                />
                <div className="absolute z-10 bottom-5 left-5 w-[calc(100%-2.5rem)] flex flex-col gap-2">
                  <p className="font-satoshi font-bold uppercase text-[10px] leading-[1.5] bg-white text-[#656565] px-2 rounded-full self-start">
                    Password protected
                  </p>
                  <div className="flex flex-col gap-0">
                    <p className="font-satoshi text-[16px] text-white">Acquia Unification</p>
                    <p className="font-ppmondwest text-[32px] leading-[1.5] text-white">
                      How I&apos;m designing the future of Acquia, a challenging design problem that
                      is the focus of Acquia at the moment
                    </p>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/case-studies/acquia-ai" className="flex flex-col gap-2">
              <div className="relative h-[540px] w-full overflow-hidden rounded-[16px] bg-[#686868]">
                <DitherBackground
                  className="h-full w-full"
                  dotColor="#999999"
                  pixelSize={1}
                  cellMultiplier={1}
                  waveSpeed={0.2}
                  ringThickness={1}
                  waveProfile="sharp"
                  waveShape="square"
                />
                <div className="absolute z-10 bottom-5 left-5 w-[calc(100%-2.5rem)] flex flex-col gap-2">
                  <p className="font-satoshi font-bold uppercase text-[10px] leading-[1.5] bg-white text-[#656565] px-2 rounded-full self-start">
                    Password protected
                  </p>
                  <div className="flex flex-col gap-0">
                    <p className="font-satoshi text-[16px] text-white">Acquia AI</p>
                    <p className="font-ppmondwest text-[32px] leading-[1.5] text-white">
                      How I designed and shipped an MVP for a brand new product in 2 months
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
