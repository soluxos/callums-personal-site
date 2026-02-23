import DitherBackground from "@/components/DitherBackground/DitherBackground";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col md:gap-[240px] gap-[120px]">
      <section className="flex w-full flex-col gap-5">
        <h1 className="w-full max-w-[591px] font-ppmondwest text-[48px] leading-[1.25]">
          Hey, I&apos;m Callum Harrod. I design and develop things.
        </h1>
        <p className="w-full max-w-[591px] text-[14px] font-medium leading-[1.5] text-[#656565]">
          I&apos;ve got over 10 years of experience working in design, development. I&apos;m
          currently the lead designer for two projects at Acquia. When I&apos;m not working at
          Acquia, I&apos;m tinkering with my side projects.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/case-studies/drupal-canvas" className="flex flex-col gap-2 md:col-span-2">
            <div className="relative h-[540px] w-full overflow-hidden rounded-[16px] bg-[#6f6f6f]">
              <DitherBackground
                className="h-full w-full"
                dotColor="#cccccc"
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
                  <p className="font-satoshi text-[16px] text-white">Drupal Canvas</p>
                  <p className="font-ppmondwest text-[32px] leading-[1.5] text-white">
                    How I designed and helped ship the future of building and editing websites with
                    Drupal
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
            <p className="font-ppmondwest text-[16px] leading-[1.5] underline">Your Next Tale</p>
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
            <p className="font-ppmondwest text-[16px] leading-[1.5] underline">
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
            <p className="font-ppmondwest text-[16px] leading-[1.5] underline">
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
            <p className="font-ppmondwest text-[16px] leading-[1.5] underline">
              Maybe Framer Template
            </p>
          </Link>
        </div>
      </section>

      <section className="flex flex-col gap-5 lg:flex-row">
        <h2 className="w-[345px] font-ppmondwest text-[24px] leading-[1.25]">Experience</h2>
        <div className="flex flex-1 flex-col gap-10">
          <div className="flex flex-col gap-10">
            <p className="font-ppmondwest text-[48px] leading-[1.25]">
              My background is a mixture of{" "}
              <span className="text-[oklch(0.71_0.18_71.62)]">design</span> and{" "}
              <span className="text-[oklch(0.71_0.18_-138.38)]">development</span>, used to create
              wonderful digital experiences.
            </p>
            <div className="h-px w-[80px] bg-[#484848]" />
          </div>
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-5 lg:flex-row">
              <div className="w-[345px] min-w-[345px]">
                <p className="font-ppmondwest text-[24px] leading-[1.25]">
                  Senior Product Designer
                </p>
                <p className="font-ppmondwest text-[16px] leading-[1.25] text-[#656565]">
                  Acquia /1 year
                </p>
              </div>
              <div className="flex-1 text-[14px] font-medium leading-[1.5] text-[#656565]">
                I&apos;m currently leading two design projects at Acquia. One is to do with AI, the
                other is about the unification of Acquia&apos;s products. Before these projects I
                was leading the design of Drupal Canvas, the largest Drupal initiative in years. As
                a product designer, I create intuitive digital experiences in deeply complex problem
                spaces.
              </div>
            </div>
            <div className="flex flex-col gap-5 lg:flex-row">
              <div className="w-[345px]">
                <p className="font-ppmondwest text-[24px] leading-[1.25]">
                  Senior Software Engineer
                </p>
                <p className="font-ppmondwest text-[16px] leading-[1.25] text-[#656565]">
                  Acquia / 6 years, 3 Months
                </p>
              </div>
              <div className="flex-1 text-[14px] font-medium leading-[1.5] text-[#656565]">
                <p className="mb-0">
                  There&apos;s way more to this story than what I&apos;m about to write. For this
                  role I initially joined as &apos;Head of training&apos; for a low-code site
                  building tool in Drupal. But this was for the startup that was acquired by Acquia.
                  In this role I&apos;ve designed websites, designed new features for our product,
                  pitched to and trained customers, taught design systems, and worked as part of a
                  two man team to migrate a 150k line of code Angular app to React.
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
                <p className="font-ppmondwest text-[24px] leading-[1.25]">Front-end Web Designer</p>
                <p className="font-ppmondwest text-[16px] leading-[1.25] text-[#656565]">
                  We Make Websites / 4 Months
                </p>
              </div>
              <div className="flex-1 text-[14px] font-medium leading-[1.5] text-[#656565]">
                Okay, it may look like I&apos;ve not stuck at this job long, but it didn&apos;t stop
                me having a brilliant impact. In this job I worked on multiple Shopify websites. I
                helped design new features, and I worked on developing them too. I designed{" "}
                <a href="https://unionroasted.com" className="underline">
                  one of my favourite sites I&apos;ve ever worked on
                </a>{" "}
                and before leaving I was awarded with employee of the month (I still have the trophy
                to prove it).
              </div>
            </div>
            <div className="flex flex-col gap-5 lg:flex-row">
              <div className="w-[345px]">
                <p className="font-ppmondwest text-[24px] leading-[1.25]">
                  UI/UX Designer &amp; Developer
                </p>
                <p className="font-ppmondwest text-[16px] leading-[1.25] text-[#656565]">
                  Pragmatic / 1 year, 11 Months
                </p>
              </div>
              <div className="flex-1 text-[14px] font-medium leading-[1.5] text-[#656565]">
                I moved to this company originally as a developer. I was experience with WordPress,
                and I helped create some brilliant websites using PHP, Advanced Custom Fields, and
                good ol&apos; front-end development. After for doing this for around a year, I moved
                to the design team, as I worked with design outside of my day job. From here I
                worked with the likes of Bacardi on some fundamental UX work, still used today on
                all of their websites.
              </div>
            </div>
            <div className="flex flex-col gap-5 lg:flex-row">
              <div className="w-[345px]">
                <p className="font-ppmondwest text-[24px] leading-[1.25]">Web Developer</p>
                <p className="font-ppmondwest text-[16px] leading-[1.25] text-[#656565]">
                  UnitedUS / 6 years, 3 Months
                </p>
              </div>
              <div className="flex-1 text-[14px] font-medium leading-[1.5] text-[#656565]">
                My first job out of University! Here I worked on some incredible sites for small and
                large businesses alike. Here I worked on full-stack WordPress development (not divi
                builder, don&apos;t worry). Here I was shown how important good design was in making
                brilliant websites. This was a perfect place to start my career.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
