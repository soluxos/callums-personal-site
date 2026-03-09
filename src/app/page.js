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
                  "Oh, I'm also building a neat bookshelf website",
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
              className="relative h-auto w-full flex flex-col gap-2"
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
              className="relative h-auto w-full flex flex-col gap-2"
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
              className="relative h-auto w-full flex flex-col gap-2"
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
              className="relative h-auto w-full flex flex-col gap-2"
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

      <FadeInUp>
        <section className="flex flex-col gap-5 lg:flex-row">
          <h2 className="w-[345px] font-ppmondwest text-[24px] leading-[1.25]">Experience</h2>
          <div className="flex flex-1 flex-col gap-10">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-5 lg:flex-row">
                <div className="w-[345px] min-w-[345px]">
                  <p className="font-ppmondwest text-[24px] leading-[1.25]">
                    Senior Product Designer
                  </p>
                  <p className="font-ppmondwest text-[16px] leading-[1.25] text-[#929292]">
                    Acquia /1 year, 3 Months
                  </p>
                </div>
                <div className="flex-1 text-[14px] font-medium leading-[1.5] text-[#929292]">
                  I&apos;m currently leading two design projects at Acquia. One is to do with AI,
                  the other is about the unification of Acquia&apos;s products. Before these
                  projects I was leading the design of Drupal Canvas, the largest Drupal initiative
                  in years. As a product designer, I create intuitive digital experiences in deeply
                  complex problem spaces.
                </div>
              </div>
              <div className="flex flex-col gap-5 lg:flex-row">
                <div className="w-[345px]">
                  <p className="font-ppmondwest text-[24px] leading-[1.25]">
                    Senior Software Engineer
                  </p>
                  <p className="font-ppmondwest text-[16px] leading-[1.25] text-[#929292]">
                    Acquia / 6 years, 3 Months
                  </p>
                </div>
                <div className="flex-1 text-[14px] font-medium leading-[1.5] text-[#929292]">
                  <p className="mb-0">
                    There&apos;s way more to this story than what I&apos;m about to write. For this
                    role I initially joined as &apos;Head of training&apos; for a low-code site
                    building tool in Drupal. But this was for the startup that was acquired by
                    Acquia. In this role I&apos;ve designed websites, designed new features for our
                    product, pitched to and trained customers, taught design systems, and worked as
                    part of a two man team to migrate a 150k line of code Angular app to React.
                  </p>
                  <p className="mb-0">&nbsp;</p>
                  <p>
                    There&apos;s also been a couple of insane stories like building a project over a
                    weekend that lead to us being acquired. Building an entire website on stage at
                    Acquia Engage. Or recording me building an entire website in a day to land a new
                    customer.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-5 lg:flex-row">
                <div className="w-[345px]">
                  <p className="font-ppmondwest text-[24px] leading-[1.25]">
                    Front-end Web Designer
                  </p>
                  <p className="font-ppmondwest text-[16px] leading-[1.25] text-[#929292]">
                    We Make Websites / 4 Months
                  </p>
                </div>
                <div className="flex-1 text-[14px] font-medium leading-[1.5] text-[#929292]">
                  Okay, it may look like I&apos;ve not stuck at this job long, but it didn&apos;t
                  stop me having a brilliant impact. In this job I worked on multiple Shopify
                  websites. I helped design new features, and I worked on developing them too. I
                  designed{" "}
                  <a href="https://unionroasted.com" className="underline">
                    one of my favourite sites I&apos;ve ever worked on
                  </a>{" "}
                  and before leaving I was awarded with employee of the month (I still have the
                  trophy to prove it).
                </div>
              </div>
              <div className="flex flex-col gap-5 lg:flex-row">
                <div className="w-[345px]">
                  <p className="font-ppmondwest text-[24px] leading-[1.25]">
                    UI/UX Designer &amp; Developer
                  </p>
                  <p className="font-ppmondwest text-[16px] leading-[1.25] text-[#929292]">
                    Pragmatic / 1 year, 11 Months
                  </p>
                </div>
                <div className="flex-1 text-[14px] font-medium leading-[1.5] text-[#929292]">
                  I moved to this company originally as a developer. I was experience with
                  WordPress, and I helped create some brilliant websites using PHP, Advanced Custom
                  Fields, and good ol&apos; front-end development. After for doing this for around a
                  year, I moved to the design team, as I worked with design outside of my day job.
                  From here I worked with the likes of Bacardi on some fundamental UX work, still
                  used today on all of their websites.
                </div>
              </div>
              <div className="flex flex-col gap-5 lg:flex-row">
                <div className="w-[345px]">
                  <p className="font-ppmondwest text-[24px] leading-[1.25]">Web Developer</p>
                  <p className="font-ppmondwest text-[16px] leading-[1.25] text-[#929292]">
                    UnitedUS / 6 years, 3 Months
                  </p>
                </div>
                <div className="flex-1 text-[14px] font-medium leading-[1.5] text-[#929292]">
                  My first job out of University! Here I worked on some incredible sites for small
                  and large businesses alike. Here I worked on full-stack WordPress development (not
                  divi builder, don&apos;t worry). Here I was shown how important good design was in
                  making brilliant websites. This was a perfect place to start my career.
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInUp>
    </main>
  );
}
