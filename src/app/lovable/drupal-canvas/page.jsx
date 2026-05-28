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

export default function DrupalCanvasLovable() {
  const slides = [
    <TitleSlide
      key="title"
      title="Drupal Canvas"
      subtitle="A node-based design system editor for Drupal CMS. Reimagining how content creators interact with complex design systems."
      meta={[
        { label: "Role", value: "Sr. Product Designer & Engineer" },
        { label: "Timeline", value: "Jan 2025 - Present" },
        { label: "Impact", value: "4,500+ sites in 3.5 months" },
      ]}
    />,

    <ContentSlide
      key="problem"
      title="The Problem"
      content={
        <>
          <p>
            Drupal&apos;s content editing experience has long lagged behind modern expectations.
            Content creators struggled with complex, unintuitive interfaces that required technical
            knowledge to operate.
          </p>
          <p>
            The existing tools forced users into rigid, linear workflows that didn&apos;t match how
            they actually think about content and design.
          </p>
        </>
      }
      aside={
        <div className="flex h-[200px] w-[200px] items-center justify-center rounded-2xl border border-[#e8e8e8] bg-[#f8f8f8]">
          <span className="text-[48px]">🧩</span>
        </div>
      }
    />,

    <ProcessSlide
      key="process"
      title="My Process"
      steps={[
        {
          title: "Discovery & Research",
          description:
            "Interviewed 20+ content editors to understand pain points with existing Drupal workflows.",
        },
        {
          title: "Design System Architecture",
          description:
            "Built an atomic design system from scratch, extending an existing UI library for CMS-specific needs.",
        },
        {
          title: "Prototyping & Testing",
          description:
            "Rapid prototyping with live user testing sessions to validate the node-based approach.",
        },
        {
          title: "Engineering & Iteration",
          description: "Led front-end development, iterating weekly based on community feedback.",
        },
        {
          title: "Training & Documentation",
          description:
            "Trained 5 designers and documented every component for open-source contributors.",
        },
      ]}
    />,

    <FullBleedSlide
      key="hero-bleed"
      src="/images/case-studies/drupal-canvas/content-canvas.png"
      alt="Drupal Canvas in action"
      title="Visual. Intuitive. Powerful."
      subtitle="A live canvas that lets creators see exactly what they're building."
    />,

    <ImageSlide
      key="design-system"
      src="/images/projects/drupal-canvas/design-system.png"
      alt="Drupal Canvas design system"
      caption="An atomic design system built with scalability and ease of use in mind"
      variant="contained"
    />,

    <SplitSlide
      key="features"
      left={
        <div className="flex flex-col gap-4">
          <h3 className="font-ppmondwest text-[28px] text-[#1a1a1a]">Node-Based Editing</h3>
          <p className="text-[15px] leading-[1.7] text-[#6b6b6b]">
            A completely new paradigm for content editing. Users connect design system components
            visually, creating complex layouts through an intuitive drag-and-drop interface.
          </p>
        </div>
      }
      right={
        <img
          src="/images/case-studies/drupal-canvas/design-system-nodes.png"
          alt="Node-based editor"
          className="max-h-[400px] w-auto rounded-xl"
        />
      }
    />,

    <FeatureGridSlide
      key="features-grid"
      title="Key Capabilities"
      features={[
        {
          icon: "🎨",
          title: "Design System Native",
          description:
            "Components inherit from a shared design system, ensuring consistency across all pages.",
        },
        {
          icon: "🔗",
          title: "Node Connections",
          description:
            "Wire components together visually, defining data flow and layout relationships.",
        },
        {
          icon: "🤖",
          title: "AI Assistance",
          description:
            "Built-in AI helps suggest layouts, write copy, and generate component configurations.",
        },
        {
          icon: "👁️",
          title: "Live Preview",
          description:
            "See changes in real-time with a pixel-perfect preview that matches production output.",
        },
        {
          icon: "📦",
          title: "Template Library",
          description:
            "Pre-built templates accelerate page creation while maintaining design system compliance.",
        },
        {
          icon: "👥",
          title: "Team Collaboration",
          description:
            "Multiple editors can work on the same page with real-time presence indicators.",
        },
      ]}
    />,

    <SplitSlide
      key="code-editor"
      left={
        <img
          src="/images/case-studies/drupal-canvas/code-editor.png"
          alt="Code editor integration"
          className="max-h-[400px] w-auto rounded-xl"
        />
      }
      right={
        <div className="flex flex-col gap-4">
          <h3 className="font-ppmondwest text-[28px] text-[#1a1a1a]">Code-Level Control</h3>
          <p className="text-[15px] leading-[1.7] text-[#6b6b6b]">
            For developers who prefer code, a seamless editor integration allows direct template
            manipulation while maintaining the visual benefits of the design system.
          </p>
        </div>
      }
    />,

    <QuoteSlide
      key="quote"
      quote="Drupal Canvas has completely transformed how our team approaches content creation. What used to take hours now takes minutes."
      author="Early Adopter Feedback"
      role="Drupal community member"
    />,

    <MetricsSlide
      key="metrics"
      title="Impact"
      metrics={[
        { value: "4,500+", label: "Sites adopted in 3.5 months" },
        { value: "60%", label: "Reduction in time-to-publish" },
        { value: "20+", label: "User interviews conducted" },
        { value: "5", label: "Designers trained" },
      ]}
    />,
  ];

  return <LovableSlideshow slides={slides} title="Drupal Canvas" />;
}
