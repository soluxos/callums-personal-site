"use client";

import LovableSlideshow from "@/components/lovable/LovableSlideshow";
import TitleSlide from "@/components/lovable/slides/TitleSlide";
import ImageSlide from "@/components/lovable/slides/ImageSlide";
import ContentSlide from "@/components/lovable/slides/ContentSlide";
import SplitSlide from "@/components/lovable/slides/SplitSlide";
import QuoteSlide from "@/components/lovable/slides/QuoteSlide";
import MetricsSlide from "@/components/lovable/slides/MetricsSlide";
import FeatureGridSlide from "@/components/lovable/slides/FeatureGridSlide";
import ProcessSlide from "@/components/lovable/slides/ProcessSlide";
import FullBleedSlide from "@/components/lovable/slides/FullBleedSlide";
import GallerySlide from "@/components/lovable/slides/GallerySlide";
import ComparisonSlide from "@/components/lovable/slides/ComparisonSlide";
import StatementSlide from "@/components/lovable/slides/StatementSlide";
import TextListSlide from "@/components/lovable/slides/TextListSlide";
import TeamSlide from "@/components/lovable/slides/TeamSlide";
import TimelineSlide from "@/components/lovable/slides/TimelineSlide";
import LargeNumberSlide from "@/components/lovable/slides/LargeNumberSlide";
import EndSlide from "@/components/lovable/slides/EndSlide";

export default function TemplatesPage() {
  const slides = [
    // 1. Title Slide
    <TitleSlide
      key="title"
      title="Title Slide"
      subtitle="A subtitle that provides additional context about the presentation or case study."
      meta={[
        { label: "Label", value: "Value" },
        { label: "Label", value: "Value" },
        { label: "Label", value: "Value" },
      ]}
    />,

    // 2. Statement Slide
    <StatementSlide
      key="statement"
      statement="A bold statement that commands attention and communicates a single powerful idea."
    />,

    // 3. Content Slide
    <ContentSlide
      key="content"
      title="Content Slide"
      content={
        <>
          <p>
            Primary content paragraph that explains the main point. This slide type is ideal for
            presenting detailed information alongside an optional visual aside.
          </p>
          <p>
            A second paragraph can provide additional context, supporting details, or expand on the
            main narrative.
          </p>
        </>
      }
      aside={
        <div className="flex h-[180px] w-[180px] items-center justify-center rounded-2xl border border-[#e8e8e8] bg-[#f8f8f8]">
          <span className="text-[13px] text-[#a0a0a0]">Visual aside</span>
        </div>
      }
    />,

    // 4. Split Slide
    <SplitSlide
      key="split"
      left={
        <div className="flex flex-col gap-4">
          <h3 className="font-ppmondwest text-[28px] text-[#1a1a1a]">Split Slide</h3>
          <p className="text-[15px] leading-[1.7] text-[#6b6b6b]">
            The left panel typically holds text content — a heading, description, or key points.
            This layout works well for pairing narrative with imagery.
          </p>
        </div>
      }
      right={
        <div className="flex h-[280px] w-full items-center justify-center rounded-xl border border-[#e8e8e8] bg-[#f8f8f8]">
          <span className="text-[13px] text-[#a0a0a0]">Image or visual</span>
        </div>
      }
    />,

    // 5. Image Slide
    <ImageSlide
      key="image"
      src="/images/case-studies/drupal-canvas/content-canvas.png"
      alt="Placeholder image"
      caption="A caption describing the image content and providing context"
      variant="contained"
    />,

    // 6. Full Bleed Slide
    <FullBleedSlide
      key="fullbleed"
      src="/images/case-studies/drupal-canvas/content-canvas.png"
      alt="Full bleed background"
      title="Full Bleed Slide"
      subtitle="Edge-to-edge imagery with gradient overlay and centred text content."
    />,

    // 7. Quote Slide
    <QuoteSlide
      key="quote"
      quote="A meaningful quote that resonates with the audience and reinforces the narrative of the presentation."
      author="Author Name"
      role="Role or attribution"
    />,

    // 8. Metrics Slide
    <MetricsSlide
      key="metrics"
      title="Metrics Slide"
      metrics={[
        { value: "99%", label: "First metric" },
        { value: "2.5x", label: "Second metric" },
        { value: "150+", label: "Third metric" },
        { value: "< 1s", label: "Fourth metric" },
      ]}
    />,

    // 9. Large Number Slide
    <LargeNumberSlide
      key="large-number"
      number="42"
      label="A single impactful number"
      description="Use this slide to highlight one key statistic or metric that tells the story on its own."
    />,

    // 10. Feature Grid Slide
    <FeatureGridSlide
      key="feature-grid"
      title="Feature Grid Slide"
      features={[
        {
          icon: "◆",
          title: "Feature One",
          description: "Brief description of this feature or capability.",
        },
        {
          icon: "◇",
          title: "Feature Two",
          description: "Brief description of this feature or capability.",
        },
        {
          icon: "○",
          title: "Feature Three",
          description: "Brief description of this feature or capability.",
        },
        {
          icon: "□",
          title: "Feature Four",
          description: "Brief description of this feature or capability.",
        },
        {
          icon: "△",
          title: "Feature Five",
          description: "Brief description of this feature or capability.",
        },
        {
          icon: "▽",
          title: "Feature Six",
          description: "Brief description of this feature or capability.",
        },
      ]}
    />,

    // 11. Process Slide
    <ProcessSlide
      key="process"
      title="Process Slide"
      steps={[
        {
          title: "Step One",
          description: "Description of what happens in this phase of the process.",
        },
        {
          title: "Step Two",
          description: "Description of what happens in this phase of the process.",
        },
        {
          title: "Step Three",
          description: "Description of what happens in this phase of the process.",
        },
        {
          title: "Step Four",
          description: "Description of what happens in this phase of the process.",
        },
      ]}
    />,

    // 12. Timeline Slide
    <TimelineSlide
      key="timeline"
      title="Timeline Slide"
      events={[
        { date: "Q1", label: "Discovery & research phase" },
        { date: "Q2", label: "Design & prototyping" },
        { date: "Q3", label: "Development & testing" },
        { date: "Q4", label: "Launch & iteration" },
      ]}
    />,

    // 13. Text List Slide
    <TextListSlide
      key="text-list"
      title="Text List Slide"
      items={[
        "First item in a numbered list with supporting detail",
        "Second item that expands on another point",
        "Third item providing additional context",
        "Fourth item with a concluding thought",
        "Fifth item rounding out the list",
      ]}
    />,

    // 14. Gallery Slide
    <GallerySlide
      key="gallery"
      images={[
        { src: "/images/case-studies/drupal-canvas/cms-content.png", alt: "Image 1" },
        { src: "/images/case-studies/drupal-canvas/code-editor.png", alt: "Image 2" },
        { src: "/images/case-studies/drupal-canvas/content-canvas.png", alt: "Image 3" },
      ]}
      caption="A gallery slide showing multiple images in a responsive grid"
    />,

    // 15. Comparison Slide
    <ComparisonSlide
      key="comparison"
      title="Comparison Slide"
      before={
        <div className="flex h-[200px] w-full items-center justify-center bg-[#f8f8f8]">
          <span className="text-[13px] text-[#a0a0a0]">Before state</span>
        </div>
      }
      after={
        <div className="flex h-[200px] w-full items-center justify-center bg-[#f8f8f8]">
          <span className="text-[13px] text-[#a0a0a0]">After state</span>
        </div>
      }
    />,

    // 16. Team Slide
    <TeamSlide
      key="team"
      title="Team Slide"
      members={[
        { name: "Person A", role: "Role", avatar: "A" },
        { name: "Person B", role: "Role", avatar: "B" },
        { name: "Person C", role: "Role", avatar: "C" },
        { name: "Person D", role: "Role", avatar: "D" },
        { name: "Person E", role: "Role", avatar: "E" },
      ]}
    />,

    // 17. End Slide
    <EndSlide
      key="end"
      title="End Slide"
      message="A closing message or call to action for the viewer."
      links={[
        { label: "Link One", href: "#" },
        { label: "Link Two", href: "#" },
      ]}
    />,
  ];

  return <LovableSlideshow slides={slides} title="Templates" />;
}
