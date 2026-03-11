import CaseStudyBentoGrid from "@/components/case-study/CaseStudyBentoGrid";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";
import CaseStudyLayout from "@/components/case-study/CaseStudyLayout";
import CaseStudyMetaGrid from "@/components/case-study/CaseStudyMetaGrid";
import CaseStudySection from "@/components/case-study/CaseStudySection";
import CaseStudySlider from "@/components/case-study/CaseStudySlider";
import Image from "next/image";

const workFrameImage = "/images/case-studies/drupal-canvas/drupal-canvas-hero.png";

// Slider images
const cmsContentImage = "/images/case-studies/drupal-canvas/cms-content.png";
const codeEditorImage = "/images/case-studies/drupal-canvas/code-editor.png";
const contentCanvasImage = "/images/case-studies/drupal-canvas/content-canvas.png";
const contentDesignSystemNodes = "/images/case-studies/drupal-canvas/design-system-nodes.png";

const designSystemImage = "/images/projects/drupal-canvas/design-system.png";
const leftPanelImage = "/images/projects/drupal-canvas/left-panel.png";
const ellipse16 = "/images/projects/drupal-canvas/ellipse-16.png";
const ellipse17 = "/images/projects/drupal-canvas/ellipse-17.png";
const ellipse18 = "/images/projects/drupal-canvas/ellipse-18.png";
const ellipse19 = "/images/projects/drupal-canvas/ellipse-19.png";
const ellipse20 = "/images/projects/drupal-canvas/ellipse-20.png";

// Union Roasted images
const unionRoastedHero = "/images/case-studies/union-roasted/hero.png";
const productHero = "/images/case-studies/union-roasted/product-hero.png";
const unionBlog = "/images/case-studies/union-roasted/union-blog.png";

export default function DrupalCanvasCaseStudy() {
  const sections = [
    { label: "Overview", id: "overview" },
    "The problem",
    "My involvement",
    "What it looks like",
    "End notes",
  ];

  const metaItems = [
    {
      label: "Role",
      value: "Web Designer, Web Developer",
    },
    {
      label: "Outcome",
      value: "A new e-commerce website for a coffee brand built on Shopify",
    },
    {
      label: "Deliverables",
      value: "Wireframes, High-Fidelity Design, Web Development",
    },
    {
      label: "Timeline",
      value: "Aug 2018 - Sep 2018",
    },
  ];

  const bentoItems = [
    {
      title: "Crafted a design system",
      description:
        "An atomic design system built using an existing UI library. Extended for our needs and evolved with a focus on ease of use.",
      media: (
        <img
          alt="Design system"
          className="h-auto w-full object-contain max-h-full"
          src={designSystemImage}
        />
      ),
      variant: "designSystem",
    },
    {
      title: "Documented everything",
      description: "Every single component is clearly defined and explains it’s use.",
      media: <img alt="Documentation" className="w-[487px] !max-w-[487px]" src={leftPanelImage} />,
      variant: "image-corner",
    },
    {
      title: "AI Native",
      description: "AI was a requirement, so it was built in to feel as seamless as possible.",
      media: (
        <img
          alt="AI Native prompt"
          className="h-auto w-[248px]"
          src="/images/projects/drupal-canvas/ai-native-bubble.svg"
        />
      ),
      variant: "centered",
    },
    {
      title: "Help and train designers",
      description:
        "As the lead for the project I’ve had to help and train all other designers on the project",
      media: (
        <div className="flex items-center gap-2">
          {[ellipse16, ellipse17, ellipse18, ellipse19, ellipse20].map(src => (
            <img key={src} alt="Team member" className="h-12 w-12" src={src} />
          ))}
        </div>
      ),
      variant: "centered",
    },
    {
      title: "Handled the small details",
      description: "Every piece of the UI went through me, from working closely with the engineers",
      media: (
        <img
          alt="Small details"
          className="h-auto w-[300px]"
          src="/images/projects/drupal-canvas/small-details.svg"
        />
      ),
      variant: "centered",
    },
    {
      title: "New features",
      description:
        "I’ve designed new features. There have been prototypes and user flows to showcase it all",
      media: (
        <img
          alt="New features"
          className="h-auto w-[320px]"
          src="/images/projects/drupal-canvas/new-features.svg"
        />
      ),
      variant: "centered",
    },
  ];

  const sliderImages = [
    {
      src: unionRoastedHero,
      alt: "Union Roasted home page",
    },
    {
      src: productHero,
      alt: "Union Roasted product page",
    },
    {
      src: unionBlog,
      alt: "Union Roasted blog page",
    },
  ];

  return (
    <CaseStudyLayout sections={sections}>
      <main className="flex flex-col gap-[120px]">
        <div id="overview" className="flex flex-col gap-20 scroll-mt-8">
          <CaseStudyHero
            title="Union Roasted"
            description="The story of how I designed a site for one of the largest UK coffee brands. In 2018 I worked at an agency to create one of my favourite pieces of design work, while nailing the brief for the customer."
          />
          <CaseStudyMetaGrid items={metaItems} />
        </div>

        <section className="w-full">
          <CaseStudySlider images={sliderImages} />
        </section>

        <CaseStudySection title="The problem">
          <div className="flex flex-col gap-5 max-w-[710px]">
            {/* Left bubble */}
            <div className="flex flex-col items-start">
              <div className="relative bg-[#ededed] rounded-[8px] px-4 py-2 max-w-[467px]">
                <p className="font-satoshi text-[14px] font-medium leading-[1.25] text-[#656565]">
                  We really want a new site for our coffee brand. We know that WeMakeWebsites makes
                  shopify sites. We don't want our site to look like a Shopify site though. We want
                  something that represents our brand.
                </p>
                <svg
                  className="absolute -bottom-[6px] left-[16px]"
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                >
                  <path d="M0 0L10 0L0 6Z" fill="#ededed" />
                </svg>
              </div>
            </div>
            {/* Right bubble */}
            <div className="flex justify-end">
              <div className="relative bg-[#0090ff] rounded-[8px] px-4 py-2 max-w-[467px]">
                <p className="font-satoshi text-[14px] font-medium leading-[1.25] text-white">
                  No problem. What I'll be doing is understanding your brand, and creating a design
                  that represents it. I also wouldn't want it to look like everything else.
                </p>
                <svg
                  className="absolute -bottom-[6px] right-[16px]"
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                >
                  <path d="M10 0L0 0L10 6Z" fill="#0090ff" />
                </svg>
              </div>
            </div>
            {/* Left bubble */}
            <div className="flex flex-col items-start">
              <div className="relative bg-[#ededed] rounded-[8px] px-4 py-2 max-w-[467px]">
                <p className="font-satoshi text-[14px] font-medium leading-[1.25] text-[#656565]">
                  We make coffee and want to highlight our process. We want to show off our team. We
                  want to sell our freshly roasted coffee. Can you capture all of this in a your
                  design?
                </p>
                <svg
                  className="absolute -bottom-[6px] left-[16px]"
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                >
                  <path d="M0 0L10 0L0 6Z" fill="#ededed" />
                </svg>
              </div>
            </div>
            {/* Right bubble */}
            <div className="flex justify-end">
              <div className="relative bg-[#0090ff] rounded-[8px] px-4 py-2 max-w-[467px]">
                <p className="font-satoshi text-[14px] font-medium leading-[1.25] text-white">
                  Absolutely. I will make sure to understand your process, your team, and your
                  coffee. Let's get cracking.
                </p>
                <svg
                  className="absolute -bottom-[6px] right-[16px]"
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                >
                  <path d="M10 0L0 0L10 6Z" fill="#0090ff" />
                </svg>
              </div>
            </div>
          </div>
        </CaseStudySection>

        <CaseStudySection title="Understanding the client">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-4 text-[14px] font-medium leading-[1.5] text-[#656565]">
              <p>
                I worked on this site from start to finish. I was there for the initial discovery,
                the research, the design, the development, and the launch. I was the only designer
                on the project, I worked closely with the Project Manager. In our initial kick off
                meeting with the client, they made it incrediby clear that they didn't want a
                typical Shopify site.
              </p>
              <p>
                I quickly had to understand the brand, the product, and the people behind it. Union
                Roasted was a coffee I'd purchased myself in stores, so it was a really fun
                experience in understanding how everything was made. The PM and I went to the
                roastery to find out how everything worked and learn more about their brand.
              </p>
              <p>
                They made it clear that they wanted to show off their process, the quality of their
                beans, and the partnerships with the farmers. This gave me some great opportunities
                to show off my design skills and create a really unique site that stood out from the
                typical Shopify sites.
              </p>
            </div>
            <div className="space-y-4 text-[14px] font-medium leading-[1.5] text-[#656565]"></div>
          </div>
        </CaseStudySection>

        <CaseStudySection title="What it looks like">
          <div className="bg-[#ededed] p-5 rounded-[16px]">
            <img
              src="/images/case-studies/union-roasted/full-product.png"
              alt="Final design"
              className="w-full"
            />
          </div>
        </CaseStudySection>

        <CaseStudySection title="End notes">
          <div className="max-w-[588px] space-y-4 text-[14px] font-medium leading-[1.5] text-[#656565]">
            <p>
              As you can probably tell, this isn’t a typical case study where I go into absolutely
              everything. If you want to know more about the project, I’ll happily show you how I’ve
              created everything listed above and more. This has been created as a way of showing
              the value I’ve generated for this product.
            </p>
            <p>
              However, this project isn’t a typical design process. Many times I’ve had to work as a
              product manager to figure out the requirements, or I’ve had to work as an engineer to
              solve technical limitations. None of this fits into the regular design workflow, but
              that’s fine!
            </p>
            <p>
              Ultimately, I solve problems, but I don’t let anything get in the way of that. I think
              you need to be a nerd to solve this stuff, and if that means working outside of the
              realms of a typical product designer. So be it.
            </p>
          </div>
        </CaseStudySection>
      </main>
    </CaseStudyLayout>
  );
}
