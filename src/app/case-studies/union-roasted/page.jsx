import CaseStudyFullHero from "@/components/case-study/CaseStudyFullHero";
import CaseStudyLayout from "@/components/case-study/CaseStudyLayout";
import CaseStudyRole from "@/components/case-study/CaseStudyRole";
import CaseStudySection from "@/components/case-study/CaseStudySection";
import CaseStudySlider from "@/components/case-study/CaseStudySlider";
import { pageMetadata } from "@/lib/metadata";

const img = name => `/images/case-studies/union-roasted/${name}`;

const body = "max-w-[588px] space-y-4 text-[14px] font-medium leading-[1.5] text-[#656565]";

export const metadata = pageMetadata({
  title: "Union Roasted · Callum Harrod",
  description:
    "I designed every page of Union Roasted's Shopify site and built it, and Union still use that design today.",
  path: "/case-studies/union-roasted",
});

// A chat bubble for the brief. `me` puts it on the right in blue.
function Bubble({ me = false, children }) {
  return (
    <div className={`flex ${me ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-[467px] rounded-[8px] px-4 py-2 ${me ? "bg-[#0090ff]" : "bg-[#ededed]"}`}
      >
        <p
          className={`font-satoshi text-[14px] font-medium leading-[1.25] ${me ? "text-white" : "text-[#656565]"}`}
        >
          {children}
        </p>
        <svg
          className={`absolute -bottom-[6px] ${me ? "right-[16px]" : "left-[16px]"}`}
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          aria-hidden="true"
        >
          <path d={me ? "M10 0L0 0L10 6Z" : "M0 0L10 0L0 6Z"} fill={me ? "#0090ff" : "#ededed"} />
        </svg>
      </div>
    </div>
  );
}

export default function UnionRoastedCaseStudy() {
  const sections = [
    { label: "My role", id: "my-role" },
    "The brief",
    "Understanding the client",
    "What it looks like",
    "Results",
  ];

  return (
    <>
      <CaseStudyFullHero
        title="Union Roasted"
        description="A Shopify site for one of the UK's best-known specialty coffee roasters. I designed every page and built the whole site, and Union still use the design today."
        logo="/images/logos/union-logo.png"
        logoAlt="Union Roasted logo"
        preset="rachelChen"
        metaItems={[
          { label: "Role", value: "Web designer and developer" },
          { label: "Team", value: "Me and a Project Manager at WeMakeWebsites" },
          { label: "Timeline", value: "Aug 2018 - Sep 2018" },
          { label: "Outcome", value: "A site that looks like Union, still in use years later" },
        ]}
      />
      <CaseStudyLayout sections={sections}>
        <main className="flex flex-col gap-[120px] mt-20">
          <CaseStudyRole
            summary="I was the only designer and developer on this project. I worked alongside a Project Manager, and we did the discovery together."
            owned={[
              "The design of every page, from wireframes to high-fidelity",
              "Building the whole site on Shopify",
            ]}
            shared={["The client kick-off and the visit to the roastery, with the Project Manager"]}
            others={["Project management, by the Project Manager"]}
          />

          <section className="flex w-full flex-col gap-3">
            <CaseStudySlider
              images={[
                {
                  src: img("hero.webp"),
                  alt: "Union Roasted home page with a full-width photo of coffee plants",
                },
                {
                  src: img("product-hero.webp"),
                  alt: "Union Roasted product page for Verde Alto, a Costa Rican coffee, with size and grind options",
                },
                {
                  src: img("union-blog.webp"),
                  alt: "Union Roasted blog article about ten years of sourcing wild forest coffee in Ethiopia",
                },
              ]}
            />
            <p className="text-[13px] font-medium text-[#6b6b6b]">
              The live site, captured in 2025. Union have added pages since, but these are still my
              designs.
            </p>
          </section>

          <CaseStudySection title="The brief">
            <p className="text-[13px] font-medium text-[#6b6b6b]">
              Paraphrased from the kick-off, not a real transcript.
            </p>
            <div className="flex max-w-[710px] flex-col gap-5">
              <Bubble>
                We really want a new site for our coffee brand. We know WeMakeWebsites makes Shopify
                sites. We don&apos;t want our site to look like a Shopify site though. We want
                something that represents our brand.
              </Bubble>
              <Bubble me>
                No problem. I&apos;ll get to know your brand and design something that represents
                it. I wouldn&apos;t want it to look like everything else either.
              </Bubble>
              <Bubble>
                We make coffee and want to show off our process. We want to show off our team. We
                want to sell our freshly roasted coffee. Can you capture all of that in your design?
              </Bubble>
              <Bubble me>
                Absolutely. I&apos;ll make sure I understand your process, your team and your
                coffee. Let&apos;s get cracking.
              </Bubble>
            </div>
          </CaseStudySection>

          <CaseStudySection title="Understanding the client">
            <div className={body}>
              <p>
                At the kick-off, the client made it very clear they didn&apos;t want a typical
                Shopify site. So I had to understand the brand, the product and the people behind it
                quickly. I&apos;d bought Union coffee in shops myself, which made this a fun one.
                The Project Manager and I went to the roastery to see how everything was made and
                learn more about the brand.
              </p>
              <p>
                They wanted to show off their process, the quality of their beans and their
                partnerships with farmers. That gave me plenty to design with, and a clear reason
                for the site to look nothing like a standard Shopify theme.
              </p>
            </div>
          </CaseStudySection>

          <CaseStudySection title="What it looks like">
            <div className="rounded-[16px] bg-[#ededed] p-5">
              <img
                src={img("full-product.webp")}
                alt="Full-length Union Roasted product page, from product details to the farm story, related coffees and footer"
                className="w-full"
              />
              <p className="mt-3 text-[13px] font-medium text-[#6b6b6b]">
                A full product page, from the coffee&apos;s details down to the farm it came from.
              </p>
            </div>
          </CaseStudySection>

          <CaseStudySection title="Results">
            <div className={body}>
              <p>
                The client was very happy with it. They expected a generic Shopify site and got one
                that looked like them. Years later,{" "}
                <a href="https://unionroasted.com" className="underline">
                  unionroasted.com
                </a>{" "}
                still uses my design.
              </p>
              <p>
                It&apos;s been a while, and the wireframes and early work didn&apos;t survive, but
                it&apos;s still one of my favourite projects. I was named Employee of the Month for
                it before I left WeMakeWebsites, and I&apos;ve still got the trophy to prove it.
              </p>
            </div>
          </CaseStudySection>
        </main>
      </CaseStudyLayout>
    </>
  );
}
