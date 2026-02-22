import CaseStudyBentoGrid from "@/components/case-study/CaseStudyBentoGrid";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";
import CaseStudyMetaGrid from "@/components/case-study/CaseStudyMetaGrid";
import CaseStudySection from "@/components/case-study/CaseStudySection";
import CaseStudySlider from "@/components/case-study/CaseStudySlider";
import PasswordGate from "@/components/PasswordGate/PasswordGate";

const heroImage = "/images/case-studies/acquia-unification/hero.png";
const whatIveDone1 = "/images/case-studies/acquia-unification/what-ive-done-1.png";
const whatIveDone2 = "/images/case-studies/acquia-unification/what-ive-done-2.png";
const whatIveDone3 = "/images/case-studies/acquia-unification/what-ive-done-3.png";
const whatIveDone4 = "/images/case-studies/acquia-unification/what-ive-done-4.png";
const whatIveDone5 = "/images/case-studies/acquia-unification/what-ive-done-5.png";

export default function AcquiaUnificationCaseStudy() {
  return (
    <PasswordGate password={process.env.NEXT_PUBLIC_PASSWORD}>
      <main className="flex flex-col gap-[120px]">
        <div className="flex flex-col gap-20">
          <CaseStudyHero
            title="Acquia Command Center"
            description="As a business, Acquia has wanted to go after the DXP market. Acquia also has many separated business units, such as hosted Drupal applications, SasS Drupal, digital asset management and more. This project is Acquia’s huge undertaking to unify these projects into a single cohesive interface."
          />
          <CaseStudyMetaGrid
            items={[
              { label: "Role", value: "Senior Product Designer (Lead)" },
              {
                label: "Outcome",
                value: "A product that could house all existing Acquia products",
              },
              {
                label: "Deliverables",
                value:
                  "Design system, User Flows, UI design, new features, existing product design changes",
              },
              { label: "Timeline", value: "Jan 2026 - Now" },
            ]}
          />
        </div>

        <section className="w-full">
          <div className="flex flex-col rounded-[16px] bg-[#ededed] p-10">
            <img
              alt="Acquia Command Center interface"
              className="h-auto w-full rounded-[12px] object-cover"
              src={heroImage}
            />
          </div>
        </section>

        <CaseStudySection title="The problem">
          <div className="max-w-[588px] space-y-4 text-[14px] font-medium leading-[1.5] text-[#656565]">
            <p>
              In a world where AI is becoming paramount to digital businesses, how could Acquia
              provide one of the most powerful offerings? Acquia as a business has a great deal of
              products for managing content, it also has the capabilities of Drupal for distributing
              that content in the forms of digital applications or websites.
            </p>
            <p>
              With all of this power, we wanted to understand how we can take tools such as n8n,
              Make, Lovable, and combine this into a cohesive experience.
            </p>
            <p>
              With this we can remove the barriers to distributing your content, creating new
              experiences and more.
            </p>
          </div>
        </CaseStudySection>

        <CaseStudySection title="My involvement">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-4 text-[14px] font-medium leading-[1.5] text-[#656565]">
              <p>
                This isn’t a typical design project, usually you’d be there from the start, but I
                was late to the party. Originally I was going to be a front-end engineer on this,
                but I noticed that there wasn’t a design system in place for us to build out the
                necessary UI. This is where I started collating everything that was available from
                the original designers, and started to create a design system.
              </p>
              <p>
                This is how I was offered the job of Senior Product G at Acquia. I was making
                strides on the design system, and bringing order to what were some pretty chaotic
                design files. From here I organised everything into a clear atomic design system.
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
                interaction design, designed multiple new features that required turning very
                complex workflows into simple processes, helping new designers work on new features
                by guiding them through complex engineering requirements, and a lot more.
              </p>
            </div>
          </div>
        </CaseStudySection>

        <CaseStudySection title="What I’ve done">
          <CaseStudyBentoGrid
            rowHeight={227}
            items={[
              {
                title: "Unified the UX from all our products",
                description: "Taking multiple products and unifying the experience between them.",
                media: (
                  <img
                    alt="Redesigned UI"
                    className="h-auto w-full object-contain"
                    src={whatIveDone1}
                  />
                ),
                variant: "half-card",
              },
              {
                title: "User testing",
                description:
                  "I took what we had, validated what was working, what wasn't working, and altered our product to make the best end result possible for our users.",
                media: (
                  <img
                    alt="User Testing"
                    className="h-full w-full object-contain"
                    src={whatIveDone3}
                  />
                ),
                variant: "image-full",
                height: 2,
              },
              {
                title: "Created a full prototype with AI",
                description:
                  "With nearly 1000 prompts I've created a full working prototype for engineers and designers to work with.",
                media: (
                  <img
                    alt="AI Prototype"
                    className="h-full w-full object-contain"
                    src={whatIveDone4}
                  />
                ),
                variant: "image-full",
                height: 2,
              },
              {
                title: "Shipped our MVP",
                description:
                  "Constantly checking that what the engineers had created matched the look and feel in Figma.",
                media: (
                  <img
                    alt="Shipped MVP"
                    className="h-full w-full object-contain"
                    src={whatIveDone5}
                  />
                ),
                variant: "image-full",
                height: 2,
              },
              {
                title: "Worked on tech architecture",
                description:
                  "Helped solve the best way to approach the engineering for this project.",
                media: (
                  <img
                    alt="Tech Architecture"
                    className="h-auto w-full object-contain"
                    src={whatIveDone2}
                  />
                ),
                variant: "half-card",
              },
            ]}
          />
        </CaseStudySection>

        <CaseStudySection title="What it looks like">
          <CaseStudySlider
            images={[
              {
                src: "/images/case-studies/acquia-ai/what-ive-done-1.png",
                alt: "Acquia Prospero redesigned UI",
              },
              {
                src: "/images/case-studies/acquia-ai/what-ive-done-2.png",
                alt: "Acquia Prospero user testing",
              },
              {
                src: "/images/case-studies/acquia-ai/what-ive-done-3.png",
                alt: "Acquia Prospero product requirements",
              },
              {
                src: "/images/case-studies/acquia-ai/what-ive-done-4.png",
                alt: "Acquia Prospero shipped MVP",
              },
            ]}
          />
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
    </PasswordGate>
  );
}
