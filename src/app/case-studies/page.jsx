import Link from "next/link";
import AnimatedGradientBackground from "@/components/AnimatedGradientBackground/AnimatedGradientBackground";
import FadeInUp from "@/components/FadeInUp/FadeInUp";

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
          <p className="w-full max-w-[591px] text-[14px] font-medium leading-[1.5] text-[#929292]">
            A short selection of some projects I've worked on...
          </p>
        </section>

        <FadeInUp delay={0.1}>
          <section className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Link href="/case-studies/drupal-canvas" className="flex flex-col gap-2">
                <div className="relative h-[540px] w-full overflow-hidden rounded-[16px] bg-[#929292]">
                  <AnimatedGradientBackground
                    preset="ocean"
                    animationDuration={50}
                    blurAmount={50}
                    opacity={1}
                    grain={true}
                    grainOpacity={0.015}
                    dither={true}
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  />
                  <div className="relative z-10 p-5 pb-10 w-full h-full flex flex-col justify-center items-center">
                    <p className="absolute top-5 left-5 font-satoshi font-bold uppercase text-[10px] leading-[1.5] bg-white text-[#929292] px-2 rounded-full self-start">
                      Public
                    </p>
                    <div className="relative flex flex-col items-center justify-center text-center">
                      <div className="h-10 flex items-end justify-center mb-2">
                        <img
                          src="/images/logos/acquia-logo.svg"
                          alt="Acquia logo"
                          className="max-w-[80px]"
                        />
                      </div>
                      <p className="font-ppmondwest text-[40px] leading-[1.5] text-[#fff]">
                        Drupal Canvas
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="/case-studies/union-roasted" className="flex flex-col gap-2">
                <div className="relative h-[540px] w-full overflow-hidden rounded-[16px] bg-[#929292]">
                  <AnimatedGradientBackground
                    preset="rachelChen"
                    animationDuration={50}
                    blurAmount={50}
                    opacity={1}
                    grain={true}
                    grainOpacity={0.015}
                    dither={true}
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  />
                  <div className="relative z-10 p-5 pb-10 w-full h-full flex flex-col justify-center items-center">
                    <p className="absolute top-5 left-5 font-satoshi font-bold uppercase text-[10px] leading-[1.5] bg-white text-[#929292] px-2 rounded-full self-start">
                      Public
                    </p>
                    <div className="relative flex flex-col items-center justify-center text-center">
                      <div className="h-10 flex items-end justify-center mb-2">
                        <img
                          src="/images/logos/union-logo.png"
                          alt="Union Roasted logo"
                          className="max-w-[80px]"
                        />
                      </div>
                      <p className="font-ppmondwest text-[40px] leading-[1.5] text-[#fff]">
                        Union Roasted
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="/case-studies/acquia-unification" className="flex flex-col gap-2">
                <div className="relative h-[540px] w-full overflow-hidden rounded-[16px] bg-[#929292]">
                  <AnimatedGradientBackground
                    preset="tropical"
                    animationDuration={50}
                    blurAmount={50}
                    opacity={1}
                    grain={true}
                    grainOpacity={0.015}
                    dither={true}
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  />
                  <div className="relative z-10 p-5 pb-10 w-full h-full flex flex-col justify-center items-center">
                    <p className="absolute top-5 left-5 font-satoshi font-bold uppercase text-[10px] leading-[1.5] bg-white text-[#929292] px-2 rounded-full self-start">
                      Password Protected
                    </p>
                    <div className="relative flex flex-col items-center justify-center text-center">
                      <div className="h-10 flex items-end justify-center mb-2">
                        <img
                          src="/images/logos/acquia-logo.svg"
                          alt="Acquia logo"
                          className="max-w-[80px]"
                        />
                      </div>
                      <p className="font-ppmondwest text-[40px] leading-[1.5] text-[#fff]">
                        Acquia Unification
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="/case-studies/acquia-ai" className="flex flex-col gap-2">
                <div className="relative h-[540px] w-full overflow-hidden rounded-[16px] bg-[#929292]">
                  <AnimatedGradientBackground
                    preset="fire"
                    animationDuration={50}
                    blurAmount={50}
                    opacity={1}
                    grain={true}
                    grainOpacity={0.015}
                    dither={true}
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  />
                  <div className="relative z-10 p-5 pb-10 w-full h-full flex flex-col justify-center items-center">
                    <p className="absolute top-5 left-5 font-satoshi font-bold uppercase text-[10px] leading-[1.5] bg-white text-[#929292] px-2 rounded-full self-start">
                      Password Protected
                    </p>
                    <div className="relative flex flex-col items-center justify-center text-center">
                      <div className="h-10 flex items-end justify-center mb-2">
                        <img
                          src="/images/logos/acquia-logo.svg"
                          alt="Acquia logo"
                          className="max-w-[80px]"
                        />
                      </div>
                      <p className="font-ppmondwest text-[40px] leading-[1.5] text-[#fff]">
                        Acquia AI
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        </FadeInUp>
      </main>
    </>
  );
}
