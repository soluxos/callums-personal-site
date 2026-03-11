import CaseStudyBentoGrid from "@/components/case-study/CaseStudyBentoGrid";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";
import CaseStudyLayout from "@/components/case-study/CaseStudyLayout";
import CaseStudyMetaGrid from "@/components/case-study/CaseStudyMetaGrid";
import CaseStudySection from "@/components/case-study/CaseStudySection";
import CaseStudySlider from "@/components/case-study/CaseStudySlider";
import FadeInUp from "@/components/FadeInUp/FadeInUp";
import Link from "next/link";
import AnimatedGradientBackground from "@/components/AnimatedGradientBackground/AnimatedGradientBackground";

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
const pagination = "http://localhost:3845/assets/ec5b9cba23aca00c8cb38ae680cca857a26cf81f.svg";

export default function DrupalCanvasCaseStudy() {
  const sections = [
    { label: "Overview", id: "overview" },
    "The problem",
    "My involvement",
    "Crafting a design system",
    "Creating new features",
    "What I've done",
    "End notes",
  ];

  const metaItems = [
    {
      label: "Role",
      value: "Senior Product Designer, Senior Software Engineer",
    },
    {
      label: "Outcome",
      value: "A new site building and editing experience for Drupal",
    },
    {
      label: "Deliverables",
      value: "Design system, User Flows, Wireframes, User Testing",
    },
    {
      label: "Timeline",
      value: "Jan 2025 - Now",
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
      src: workFrameImage,
      alt: "Drupal Canvas main interface",
    },
    {
      src: cmsContentImage,
      alt: "Drupal Canvas content management screen",
    },
    {
      src: codeEditorImage,
      alt: "Drupal Canvas code editor screen",
    },
    {
      src: contentDesignSystemNodes,
      alt: "Drupal Canvas design system nodes screen",
    },
  ];

  return (
    <CaseStudyLayout sections={sections}>
      <main className="flex flex-col gap-[120px]">
        <FadeInUp>
          <div id="overview" className="flex flex-col gap-20 scroll-mt-8">
            <CaseStudyHero
              title="Drupal Canvas"
              description="How I designed and shipped the future of building and editing sites with Drupal. Early 2025 I joined the Product Design team to help, since then I led the design of the new editing and site building experience for Drupal, which is now live and being used by thousands of users."
            />
            {/* <FadeInUp delay={0.1}>
              <section className="flex flex-col gap-4">
                <div className="grid gap-4">
                  <Link
                    href="/case-studies/drupal-canvas"
                    className="flex flex-col md:col-span-2 gap-2"
                  >
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
                        <div className="relative flex flex-col items-center justify-center text-center">
                          <div className="h-10 flex items-end justify-center mb-2">
                            <img
                              src="/images/logos/acquia-logo.svg"
                              alt="Acquia logo"
                              className="max-w-[80px]"
                            />
                          </div>
                          <p className="font-ppmondwest text-[64px] leading-[1.5] text-[#fff]">
                            Drupal Canvas
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </section>
            </FadeInUp> */}

            <CaseStudyMetaGrid items={metaItems} />
          </div>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <section className="w-full">
            <CaseStudySlider images={sliderImages} />
          </section>
        </FadeInUp>

        <FadeInUp>
          <CaseStudySection title="The problem">
            <p className="max-w-[588px] text-[14px] font-medium leading-[1.5] text-[#656565]">
              Drupal is an incredibly powerful content management system, but it has a reputation
              for being difficult to use. The editing experience was clunky and unintuitive, and the
              site building experience was even worse. This was a problem for our users, and it was
              a problem for Drupal as a platform. We needed to create a new experience that would
              make Drupal more accessible and easier to use, while still maintaining the power and
              flexibility that our users love.
            </p>
          </CaseStudySection>
        </FadeInUp>

        <FadeInUp>
          <CaseStudySection title="My involvement">
            <p className="max-w-[588px] text-[14px] font-medium leading-[1.5] text-[#656565]">
              This isn’t a typical design project, usually you’d be there from the start, but I was
              late to the party. Originally I was going to be a front-end engineer on this, but I
              noticed that there wasn’t a design system in place for us to build out the necessary
              UI. This is where I started collating everything that was available from the original
              designers, and started to create a design system.
            </p>
            <p className="max-w-[588px] text-[14px] font-medium leading-[1.5] text-[#656565]">
              This is how I was offered the job of Senior Product at Acquia. I was making strides on
              the design system, and bringing order to what were some pretty chaotic design files.
              From here I organised everything into a clear atomic design system.
            </p>
            <p className="max-w-[588px] text-[14px] font-medium leading-[1.5] text-[#656565]">
              While organising I improved on the UI of each of our components. Due to the deep
              technical complexity of the product, there were some aspects of our UI that weren’t
              very intuitive, or just weren’t fit for the job.
            </p>
            <p className="max-w-[588px] text-[14px] font-medium leading-[1.5] text-[#656565]">
              Since then I have redesigned the entire UI, worked with developers closely on the
              interaction design, designed multiple new features that required turning very complex
              workflows into simple processes, helping new designers work on new features by guiding
              them through complex engineering requirements, and a lot more.
            </p>
          </CaseStudySection>
        </FadeInUp>

        <FadeInUp>
          <CaseStudySection title="Crafting a design system">
            <p className="max-w-[588px] text-[14px] font-medium leading-[1.5] text-[#656565]">
              As I said above, there wasn’t a design system in place for us to build out the
              necessary UI. This is where I started to take inventory of what we had and bring this
              into a sensible system. Take a look at what things looked like, and how it is now:
            </p>
            <img
              src={"/images/case-studies/drupal-canvas/design-system.png"}
              alt="Design system"
              className="h-auto w-full object-contain max-h-full rounded-[16px]"
            />
          </CaseStudySection>
        </FadeInUp>

        <FadeInUp>
          <CaseStudySection title="Creating new features">
            <p className="max-w-[588px] text-[14px] font-medium leading-[1.5] text-[#656565]">
              Each one of the features that I worked on were extensively broken down into clear user
              flows. This was to ensure that the engineers and other designers working on the
              project could understand the complex workflows that we had to create, and how we
              turned these into simple processes for our users.
            </p>
            <img
              src={"/images/case-studies/drupal-canvas/user-flows.png"}
              alt="Design system"
              className="h-auto w-full object-contain max-h-full rounded-[16px]"
            />
          </CaseStudySection>
        </FadeInUp>

        <FadeInUp>
          <CaseStudySection title="What I've done">
            <CaseStudyBentoGrid items={bentoItems} />
          </CaseStudySection>
        </FadeInUp>

        <FadeInUp>
          <CaseStudySection title="End notes">
            <div className="max-w-[588px] space-y-4 text-[14px] font-medium leading-[1.5] text-[#656565]">
              <p>
                As you can probably tell, this isn’t a typical case study where I go into absolutely
                everything. If you want to know more about the project, I’ll happily show you how
                I’ve created everything listed above and more. This has been created as a way of
                showing the value I’ve generated for this product.
              </p>
              <p>
                However, this project isn’t a typical design process. Many times I’ve had to work as
                a product manager to figure out the requirements, or I’ve had to work as an engineer
                to solve technical limitations. None of this fits into the regular design workflow,
                but that’s fine!
              </p>
              <p>
                Ultimately, I solve problems, but I don’t let anything get in the way of that. I
                think you need to be a nerd to solve this stuff, and if that means working outside
                of the realms of a typical product designer. So be it.
              </p>
            </div>
          </CaseStudySection>
        </FadeInUp>
      </main>
    </CaseStudyLayout>
  );
}
