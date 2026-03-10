/* eslint-disable @next/next/no-img-element */
import DitherBackground from "@/components/DitherBackground/DitherBackground";
import ImageSlideshow from "@/components/ImageSlideshow/ImageSlideshow";
import Image from "next/image";
import Link from "next/link";
import ImageMarquee from "@/components/ImageMarquee/ImageMarquee";
import AnimatedGradientBackground from "@/components/AnimatedGradientBackground/AnimatedGradientBackground";
import HeroBubbles from "@/components/HeroBubbles/HeroBubbles";
import FadeInUp from "@/components/FadeInUp/FadeInUp";

export default function Home() {
  return (
    <main className="flex flex-col md:gap-[240px] gap-[120px]">
      <div className="flex flex-col gap-[120px]">
        <FadeInUp>
          <section className="flex w-full flex-col gap-2 items-center justify-center text-center">
            <div className="hero-text-container w-auto flex flex-col gap-2 items-center justify-start">
              <HeroBubbles
                messages={[
                  "I'm currently leading design at Acquia",
                  "Oh, I'm also building a neat bookshelf web app on the side",
                  "I'm designing an AI tool for Acquia at the moment",
                  "One of two engineers that created the frontend of Site Studio, a product with $50m ARR",
                  "I'm also building a platform for all Acquia products",
                  "Created the new editor for Drupal",
                  "Currently utilising AI tools to speed up my design process",
                  "I worked at a small startup that got acquired by Acquia",
                  "Made a website in a day to land a new customer",
                  "Creating design systems for incredibly complex products",
                  "I wonder if you've stayed around for this?",
                ]}
              />
              <h1 className="font-ppmondwest text-[64px] leading-[1.25]">Hey, I&apos;m Callum.</h1>
              <p className="max-w-[480px] text-[14px] font-medium leading-[1.5] text-[#929292]">
                I'm a designer and developer with over ten years of experience in solving difficult
                problems in tech. Versed in design systems, AI tooling, and more.
              </p>
            </div>
          </section>
        </FadeInUp>

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
      </div>

      <FadeInUp>
        <section className="flex flex-col gap-6">
          <h2 className="font-ppmondwest text-[24px] leading-[1.25]">Some side projects</h2>
          <div className="grid gap-5 md:grid-cols-4">
            <Link
              href="https://yournexttale.com"
              className="relative h-auto w-full flex flex-col gap-2 overflow-hidden"
            >
              <video
                className="h-[240px] w-full object-cover overflow-hidden rounded-[8px]"
                autoPlay
                loop
                muted
              >
                <source src="/videos/ynt.mp4" type="video/mp4" />
              </video>
              <p className="font-satoshi text-[14px] text-[#929292] leading-[1.5] font-medium">
                Your Next Tale
              </p>
            </Link>
            <Link
              href="https://crisp.framer.website"
              className="relative h-auto w-full flex flex-col gap-2 overflow-hidden"
            >
              <video
                className="h-[240px] w-full object-cover overflow-hidden rounded-[8px]"
                autoPlay
                loop
                muted
              >
                <source src="/videos/crisp.mp4" type="video/mp4" />
              </video>
              <p className="font-satoshi text-[14px] text-[#929292] leading-[1.5] font-medium">
                Crisp Framer Template
              </p>
            </Link>
            <Link
              href="https://nifty.framer.website"
              className="relative h-auto w-full flex flex-col gap-2 overflow-hidden"
            >
              <video
                className="h-[240px] w-full object-cover overflow-hidden rounded-[8px]"
                autoPlay
                loop
                muted
              >
                <source src="/videos/nifty.mp4" type="video/mp4" />
              </video>
              <p className="font-satoshi text-[14px] text-[#929292] leading-[1.5] font-medium">
                Nifty Framer Template
              </p>
            </Link>
            <Link
              href="https://maybe.framer.website"
              className="relative h-auto w-full flex flex-col gap-2 overflow-hidden"
            >
              <video
                className="h-[240px] w-full object-cover overflow-hidden rounded-[8px]"
                autoPlay
                loop
                muted
              >
                <source src="/videos/maybe.mp4" type="video/mp4" />
              </video>
              <p className="font-satoshi text-[14px] text-[#929292] leading-[1.5] font-medium">
                Maybe Framer Template
              </p>
            </Link>
          </div>
        </section>
      </FadeInUp>
    </main>
  );
}
