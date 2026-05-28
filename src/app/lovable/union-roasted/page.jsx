"use client";

import LovableSlideshow from "@/components/lovable/LovableSlideshow";
import TitleSlide from "@/components/lovable/slides/TitleSlide";
import ImageSlide from "@/components/lovable/slides/ImageSlide";
import ContentSlide from "@/components/lovable/slides/ContentSlide";
import SplitSlide from "@/components/lovable/slides/SplitSlide";
import QuoteSlide from "@/components/lovable/slides/QuoteSlide";
import MetricsSlide from "@/components/lovable/slides/MetricsSlide";
import ProcessSlide from "@/components/lovable/slides/ProcessSlide";
import FullBleedSlide from "@/components/lovable/slides/FullBleedSlide";
import GallerySlide from "@/components/lovable/slides/GallerySlide";

export default function UnionRoastedLovable() {
  const slides = [
    <TitleSlide
      key="title"
      title="Union Roasted"
      subtitle="A premium e-commerce experience for a specialty coffee brand. Designed and developed from concept to launch."
      meta={[
        { label: "Role", value: "Designer & Developer" },
        { label: "Timeline", value: "Aug - Sep 2018" },
        { label: "Platform", value: "Shopify" },
      ]}
    />,

    <ContentSlide
      key="problem"
      title="The Brief"
      content={
        <>
          <p>
            Union Roasted needed a digital presence that matched the quality of their coffee. Their
            existing site was generic, template-based, and failed to communicate their brand story
            or craft.
          </p>
          <p>
            The goal was to create an immersive e-commerce experience that educated customers about
            the sourcing process while driving conversions.
          </p>
        </>
      }
      aside={
        <div className="flex h-[200px] w-[200px] items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <span className="text-[48px]">☕</span>
        </div>
      }
    />,

    <ProcessSlide
      key="process"
      title="How I Approached It"
      steps={[
        {
          title: "Brand Immersion",
          description:
            "Spent time understanding the roasting process, sourcing story, and brand values to inform the visual direction.",
        },
        {
          title: "Wireframing & IA",
          description:
            "Mapped out the full e-commerce flow from landing to checkout, optimizing for story-driven browsing.",
        },
        {
          title: "Visual Design",
          description:
            "High-fidelity mockups focusing on bold photography, whitespace, and warm tonal accents.",
        },
        {
          title: "Shopify Development",
          description:
            "Built a fully custom Liquid theme optimized for performance and mobile-first responsiveness.",
        },
      ]}
    />,

    <FullBleedSlide
      key="hero-bleed"
      src="/images/case-studies/union-roasted/hero.png"
      alt="Union Roasted homepage"
      title="Bold & Immersive"
      subtitle="An imagery-first homepage that tells the brand story from the first scroll."
    />,

    <SplitSlide
      key="product"
      left={
        <div className="flex flex-col gap-4">
          <h3 className="font-ppmondwest text-[28px] text-white">Product Experience</h3>
          <p className="text-[15px] leading-[1.7] text-white/60">
            Each product page tells a story — from origin to roast profile. Rich photography and
            deliberate typography guide the customer through the tasting notes and brewing
            recommendations.
          </p>
        </div>
      }
      right={
        <img
          src="/images/case-studies/union-roasted/product-hero.png"
          alt="Product page"
          className="max-h-[400px] w-auto rounded-xl"
        />
      }
    />,

    <ContentSlide
      key="design"
      title="Design Language"
      content={
        <>
          <p>
            The visual language centers on high-contrast photography, generous whitespace, and warm
            tonal accents that echo the coffee roasting process. Every element was designed to feel
            tactile and premium.
          </p>
          <p>
            Typography plays a key role — pairing a bold display face with a readable body font to
            create clear hierarchy across product listings, editorial content, and transactional
            pages.
          </p>
        </>
      }
    />,

    <GallerySlide
      key="gallery"
      images={[
        { src: "/images/case-studies/union-roasted/hero.png", alt: "Homepage" },
        { src: "/images/case-studies/union-roasted/product-hero.png", alt: "Product page" },
        { src: "/images/case-studies/union-roasted/union-blog.png", alt: "Blog" },
      ]}
      caption="Key pages from the final e-commerce experience"
    />,

    <SplitSlide
      key="development"
      left={
        <img
          src="/images/case-studies/union-roasted/union-blog.png"
          alt="Blog section"
          className="max-h-[350px] w-auto rounded-xl"
        />
      }
      right={
        <div className="flex flex-col gap-4">
          <h3 className="font-ppmondwest text-[28px] text-white">Editorial Content</h3>
          <p className="text-[15px] leading-[1.7] text-white/60">
            A dedicated blog section builds community, drives organic traffic, and educates
            customers about coffee origins, brewing methods, and the roasting craft.
          </p>
        </div>
      }
    />,

    <QuoteSlide
      key="quote"
      quote="The new site perfectly captures who we are. Customers tell us they feel like they're in the roastery when browsing online."
      author="Union Roasted"
      role="Founder"
    />,

    <MetricsSlide
      key="metrics"
      title="Results"
      metrics={[
        { value: "6 wks", label: "Concept to launch" },
        { value: "↑ 45%", label: "Session duration" },
        { value: "↑ 30%", label: "Conversion rate" },
        { value: "100%", label: "Custom Shopify theme" },
      ]}
    />,
  ];

  return <LovableSlideshow slides={slides} title="Union Roasted" />;
}
