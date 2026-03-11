import Image from "next/image";
import FadeInUp from "@/components/FadeInUp/FadeInUp";
import AboutChat from "@/components/about/AboutChat";

export default function About() {
  return (
    <main className="flex flex-col gap-[120px]">
      <FadeInUp>
        <section className="flex flex-col gap-5 max-w-[710px]">
          <h1 className="w-full max-w-[591px] font-ppmondwest text-[48px] leading-[1.25] mb-5">
            About
          </h1>
          <AboutChat />
        </section>
      </FadeInUp>

      <FadeInUp>
        <section className="flex flex-col gap-10">
          <h2 className="font-ppmondwest text-[24px] leading-[1.25]">Experience</h2>
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <p className="font-ppmondwest text-[24px] leading-[1.25]">Senior Product Designer</p>
              <p className="font-ppmondwest text-[16px] leading-[1.25] text-[#929292]">
                Acquia /1 year, 3 Months
              </p>
              <div className="text-[14px] font-medium leading-[1.5] text-[#929292] max-w-[588px]">
                I&apos;m currently leading two design projects at Acquia. One is to do with AI, the
                other is about the unification of Acquia&apos;s products. Before these projects I
                was leading the design of Drupal Canvas, the largest Drupal initiative in years.
                <br />
                <br />
                In my current role I&apos;m having to understand every single part of our products,
                and design solutions that work across them all. On top of being an IC, I&apos;m also
                having to train and mentor other designers to ensure cohesion between all of our
                products.
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-ppmondwest text-[24px] leading-[1.25]">Senior Software Engineer</p>
              <p className="font-ppmondwest text-[16px] leading-[1.25] text-[#929292]">
                Acquia / 6 years, 3 Months
              </p>
              <div className="text-[14px] font-medium leading-[1.5] text-[#929292] max-w-[588px]">
                <p className="mb-0">
                  As a Senior Software Engineer, I primarily worked with React. I was one of the two
                  engineers that built the frontend of Site Studio, a product with $50m ARR. This
                  included building a front-end visual building and editing interface to facilitate
                  content editors and site builders alike.
                  <br />
                  <br />
                  Prior to being a Senior Software Engineer, I was actually the Head of Training for
                  Site Studio. In this role I was responsible for training customers on how to use
                  the product, how to design websites, and how to build them. This was a very unique
                  role that had me working across design, development, and customer success. It also
                  led to us being acquired by Acquia, which is a story in itself.
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
            <div className="flex flex-col gap-2">
              <p className="font-ppmondwest text-[24px] leading-[1.25]">Front-end Web Designer</p>
              <p className="font-ppmondwest text-[16px] leading-[1.25] text-[#929292]">
                We Make Websites / 4 Months
              </p>
              <div className="text-[14px] font-medium leading-[1.5] text-[#929292] max-w-[588px]">
                In this role I was responsible for designing and building websites for a variety of
                very cool clients (at least I thought they were cool). It may look like I&apos;ve
                not stuck at this job long, but it didn&apos;t stop me having a brilliant impact. In
                this job I worked on multiple Shopify websites. I helped design new features, and I
                worked on developing them too.
                <br /> <br />I designed{" "}
                <a href="https://unionroasted.com" className="underline">
                  one of my favourite sites I&apos;ve ever worked on
                </a>{" "}
                , before leaving I was awarded with employee of the month (I still have the trophy
                to prove it), they desperately wanted to keep me, but at the time I wasn&apsos;t
                able to keeo commuting 5 hours a day.
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-ppmondwest text-[24px] leading-[1.25]">
                UI/UX Designer &amp; Developer
              </p>
              <p className="font-ppmondwest text-[16px] leading-[1.25] text-[#929292]">
                Pragmatic / 1 year, 11 Months
              </p>
              <div className="text-[14px] font-medium leading-[1.5] text-[#929292] max-w-[588px]">
                I moved to this company originally as a developer. I was experience with WordPress,
                and I helped create some brilliant websites using PHP, Advanced Custom Fields, and
                good ol&apos; front-end development. After for doing this for around a year, I moved
                to the design team, as I worked with design outside of my day job. From here I
                worked with the likes of Bacardi on some fundamental UX work, still used today on
                all of their websites.
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-ppmondwest text-[24px] leading-[1.25]">Web Developer</p>
              <p className="font-ppmondwest text-[16px] leading-[1.25] text-[#929292]">
                UnitedUS / 1 years, 2 Months
              </p>
              <div className="text-[14px] font-medium leading-[1.5] text-[#929292] max-w-[588px]">
                My first job out of University! Here I worked on some incredible sites for small and
                large businesses alike. Here I worked on full-stack WordPress development (not divi
                builder, don&apos;t worry). Here I was shown how important good design was in making
                brilliant websites. This was a perfect place to start my career.
              </div>
            </div>
          </div>
        </section>
      </FadeInUp>

      <FadeInUp>
        <section className="flex flex-col gap-6">
          <h2 className="font-ppmondwest text-[24px] leading-[1.25]">Some extra pics</h2>
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              "/images/random/37.jpg",
              "/images/about/image-2.jpg",
              "/images/random/38.jpg",
              "/images/random/11.jpg",
              "/images/about/image-4.jpg",
              "/images/random/1.jpg",
              "/images/random/2.jpg",
              "/images/random/6.jpg",
            ].map((src, index) => (
              <div
                key={`about-card-${index}`}
                className="relative h-[480px] w-full rounded-[16px] overflow-hidden"
              >
                <Image
                  src={src}
                  alt={`About image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  quality={100}
                />
              </div>
            ))}
          </div>
        </section>
      </FadeInUp>
    </main>
  );
}
