import Image from "next/image";

export default function Home() {
  const featuredProjects = [
    { src: "/images/case-study-placeholders/2.png", alt: "The Acquia unification project" },
    { src: "/images/case-study-placeholders/1.png", alt: "An Acquia AI Project" },
    { src: "/images/case-study-placeholders/3.png", alt: "Drupal Canvas" },
    { src: "/images/case-study-placeholders/4.png", alt: "Union Roasted Coffee" },
  ];

  const experience = [
    {
      title: "Senior Product Designer",
      meta: "Acquia /1 year",
      description:
        "This is the latest move in my eclectic career. I joined the design team after creating a design system. Since then I’ve been working on the largest initiative for Drupal in years; Drupal Canvas. I’ve also started working on a unified AI platform to bring all of our products together, with a sprinkling of AI to make it much more powerful.",
    },
    {
      title: "Senior Software Engineer",
      meta: "Acquia  / 6 years, 3 Months",
      description: (
        <>
          <p className="mb-0">
            There's way more to this story than what I'm about to write. For this role I initially
            joined as 'Head of training' for a low-code site building tool in Drupal. But this was
            for the startup that was acquired by Acquia. In this role I've designed websites,
            designed new features for our product, pitched to and trained customers, taught design
            systems, and worked as part of a two man team to migrate a 150k line of code Angular app
            to React.
          </p>
          <p className="mb-0">&nbsp;</p>
          <p>
            There's also been a couple of insane stories like building a project over a weekend that
            lead to us being acquired. Building an entire website on stage at Acquia Engage. Or
            recording me building an entire website in a day to land a new customer.
          </p>
        </>
      ),
    },
    {
      title: "Front-end Web Designer",
      meta: "We Make Websites  / 4 Months",
      description: (
        <>
          Okay, it may look like I've not stuck at this job long, but it didn't stop me having a
          brilliant impact. In this job I worked on multiple Shopify websites. I helped design new
          features, and I worked on developing them too. I designed{" "}
          <span className="underline">one of my favourite sites I've ever worked on</span> and
          before leaving I was awarded with employee of the month (I still have the trophy to prove
          it).
        </>
      ),
    },
    {
      title: "UI/UX Designer & Developer",
      meta: "Pragmatic / 1 year, 11 Months",
      description:
        "I moved to this company originally as a developer. I was experience with WordPress, and I helped create some brilliant websites using PHP, Advanced Custom Fields, and good ol' front-end development. After for doing this for around a year, I moved to the design team, as I worked with design outside of my day job. From here I worked with the likes of Bacardi on some fundamental UX work, still used today on all of their websites.",
    },
    {
      title: "Web Developer",
      meta: "UnitedUS  / 6 years, 3 Months",
      description:
        "I moved from engineering to the product design team as a Senior Product Designer. In this role I've worked on leading the design for the future editing experience of Drupal. The latest piece of work that I've been involved with, is an AI interface to allow our customers to use all o",
    },
  ];
  return (
    <main className="flex flex-col gap-[240px]">
      <section className="flex w-full flex-col gap-5">
        <h1 className="w-full max-w-[591px] font-ppmondwest text-[48px] leading-[1.25]">
          Hey, I’m Callum Harrod. I design and develop stuff.
        </h1>
        <p className="w-full max-w-[591px] text-[14px] font-medium leading-[1.5] text-[#656565]">
          I’ve got over 10 years of experience working in design, development, and more for the web.
          When I’m not working at Acquia, I’m tinkering with my side projects.
        </p>
      </section>

      {/*
      <section className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          {featuredProjects.slice(0, 2).map((item, index) => (
            <div key={`${item.src}-${index}`} className="flex flex-col gap-2">
              <div className="relative h-[540px] w-full overflow-hidden rounded-[16px]">
                <Image src={item.src} alt={item.alt} fill className="object-cover" />
              </div>
              <p className="w-[160px] font-ppmondwest text-[16px] leading-[1.5]">{item.alt}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {featuredProjects.slice(2).map((item, index) => (
            <div key={`${item.src}-bottom-${index}`} className="flex flex-col gap-2">
              <div className="relative h-[540px] w-full overflow-hidden rounded-[16px]">
                <Image src={item.src} alt={item.alt} fill className="object-cover" />
              </div>
              <p className="w-[160px] font-ppmondwest text-[16px] leading-[1.5]">{item.alt}</p>
            </div>
          ))}
        </div>
      </section>
      */}

      <section className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          {featuredProjects.map((item, index) => (
            <div key={`coming-soon-${item.src}-${index}`} className="flex flex-col gap-2">
              <div className="relative h-[540px] w-full overflow-hidden rounded-[16px]">
                <Image src={item.src} alt={item.alt} fill className="object-cover" />
              </div>
              <p className="font-ppmondwest text-[16px] leading-[1.5] text-[#a8a8a8] line-through">
                {item.alt}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-ppmondwest text-[24px] leading-[1.25]">Some side projects</h2>
        <div className="grid gap-5 md:grid-cols-4">
          {featuredProjects.map((item, index) => (
            <div
              key={`side-project-${item.src}-${index}`}
              className="relative h-[360px] w-full overflow-hidden rounded-[8px]"
            >
              <Image src={item.src} alt={item.alt} fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5 lg:flex-row">
        <p className="w-[345px] font-ppmondwest text-[20px] leading-[1.25]">Experience</p>
        <div className="flex flex-1 flex-col gap-10">
          <div className="flex flex-col gap-10">
            <p className="font-ppmondwest text-[48px] leading-[1.25]">
              My background is a mixture of <span className="text-[#b97800]">design</span> and{" "}
              <span className="text-[#0053ee]">development</span>, used to create wonderful digital
              experiences.
            </p>
            <div className="h-px w-[80px] bg-[#484848]" />
          </div>
          <div className="flex flex-col gap-10">
            {experience.map(item => (
              <div key={item.title} className="flex flex-col gap-5 lg:flex-row">
                <div className="w-[345px]">
                  <p className="font-ppmondwest text-[24px] leading-[1.25]">{item.title}</p>
                  <p className="font-ppmondwest text-[16px] leading-[1.25] text-[#656565]">
                    {item.meta}
                  </p>
                </div>
                <div className="flex-1 text-[14px] font-medium leading-[1.5] text-[#656565]">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
