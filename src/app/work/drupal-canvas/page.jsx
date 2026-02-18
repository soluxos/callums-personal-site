import CaseStudyBentoGrid from "@/components/case-study/CaseStudyBentoGrid";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";
import CaseStudyMetaGrid from "@/components/case-study/CaseStudyMetaGrid";
import CaseStudySection from "@/components/case-study/CaseStudySection";
import CaseStudySlider from "@/components/case-study/CaseStudySlider";

const workFrameImage = "/images/projects/drupal-canvas/work-frame.png";
const designSystemImage = "/images/projects/drupal-canvas/design-system.png";
const leftPanelImage = "/images/projects/drupal-canvas/left-panel.png";
const ellipse16 = "/images/projects/drupal-canvas/ellipse-16.png";
const ellipse17 = "/images/projects/drupal-canvas/ellipse-17.png";
const ellipse18 = "/images/projects/drupal-canvas/ellipse-18.png";
const ellipse19 = "/images/projects/drupal-canvas/ellipse-19.png";
const ellipse20 = "/images/projects/drupal-canvas/ellipse-20.png";
const pagination = "http://localhost:3845/assets/ec5b9cba23aca00c8cb38ae680cca857a26cf81f.svg";

export default function DrupalCanvasCaseStudy() {
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
      alt: "Drupal Canvas screen",
    },
    {
      src: workFrameImage,
      alt: "Drupal Canvas screen",
    },
    {
      src: workFrameImage,
      alt: "Drupal Canvas screen",
    },
  ];

  return (
    <main className="flex flex-col gap-[120px]">
      <div className="flex flex-col gap-20">
        <CaseStudyHero
          title="Drupal Canvas"
          description="Earlier this year I joined the Product Design team to help create the future of building and editing websites with Drupal. This is a case study on how I helped to create the future of Drupal."
        />
        <CaseStudyMetaGrid items={metaItems} />
      </div>

      <section className="w-full">
        <div className="flex flex-col rounded-[16px] bg-[#ededed] p-10">
          <img
            alt="Drupal Canvas interface"
            className="h-auto w-full rounded-[12px] object-cover"
            src={workFrameImage}
          />
        </div>
      </section>

      <CaseStudySection title="The problem">
        <p className="max-w-[588px] text-[14px] font-medium leading-[1.5] text-[#656565]">
          We created this product to solve an issue within Drupal; how could we make the editing
          experience and the site builder experience better for anyone using Drupal? On top of
          creating this, we had to ensure that what we were building aligned with the existing
          paradigms within Drupal, keeping the open source community happy, and building something
          that could become the foundation of Drupal.
        </p>
      </CaseStudySection>

      <CaseStudySection title="My involvement">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4 text-[14px] font-medium leading-[1.5] text-[#656565]">
            <p>
              This isn’t a typical design project, usually you’d be there from the start, but I was
              late to the party. Originally I was going to be a front-end engineer on this, but I
              noticed that there wasn’t a design system in place for us to build out the necessary
              UI. This is where I started collating everything that was available from the original
              designers, and started to create a design system.
            </p>
            <p>
              This is how I was offered the job of Senior Product G at Acquia. I was making strides
              on the design system, and bringing order to what were some pretty chaotic design
              files. From here I organised everything into a clear atomic design system.
            </p>
          </div>
          <div className="space-y-4 text-[14px] font-medium leading-[1.5] text-[#656565]">
            <p>
              While organising I improved on the UI of each of our components. Due to the deep
              technical complexity of the product, there were some aspects of our UI that weren’t
              very intuitive, or just weren’t fit for the job.
            </p>
            <p>
              Since then I have redesigned the entire UI, worked with developers closely on the
              interaction design, designed multiple new features that required turning very complex
              workflows into simple processes, helping new designers work on new features by guiding
              them through complex engineering requirements, and a lot more.
            </p>
          </div>
        </div>
      </CaseStudySection>

      <CaseStudySection title="What I’ve done">
        <CaseStudyBentoGrid items={bentoItems} />
      </CaseStudySection>

      <CaseStudySection title="What it looks like">
        <CaseStudySlider images={sliderImages} paginationImage={pagination} />
      </CaseStudySection>

      <CaseStudySection title="End notes">
        <div className="max-w-[588px] space-y-4 text-[14px] font-medium leading-[1.5] text-[#656565]">
          <p>
            As you can probably tell, this isn’t a typical case study where I go into absolutely
            everything. If you want to know more about the project, I’ll happily show you how I’ve
            created everything listed above and more. This has been created as a way of showing the
            value I’ve generated for this product.
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
  );
}
