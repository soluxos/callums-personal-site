"use client";

import LovableSlideshow from "@/components/lovable/LovableSlideshow";
import TitleSlide from "@/components/lovable/slides/TitleSlide";
import ContentSlide from "@/components/lovable/slides/ContentSlide";
import SplitSlide from "@/components/lovable/slides/SplitSlide";
import QuoteSlide from "@/components/lovable/slides/QuoteSlide";
import MetricsSlide from "@/components/lovable/slides/MetricsSlide";
import FeatureGridSlide from "@/components/lovable/slides/FeatureGridSlide";
import ProcessSlide from "@/components/lovable/slides/ProcessSlide";

export default function CommandCenterLovable() {
  const slides = [
    <TitleSlide
      key="title"
      title="Command Center"
      subtitle="A centralized operations dashboard bringing clarity to complex multi-system environments."
      meta={[
        { label: "Role", value: "Product Designer" },
        { label: "Timeline", value: "2024" },
        { label: "Type", value: "Enterprise SaaS" },
      ]}
    />,

    <ContentSlide
      key="problem"
      title="The Problem"
      content={
        <>
          <p>
            Operations teams were drowning in context switching between dozens of tools, dashboards,
            and alert systems. Critical information was scattered across siloed platforms.
          </p>
          <p>
            Teams needed a single source of truth — a centralized view that could aggregate,
            prioritize, and surface actionable insights in real-time.
          </p>
        </>
      }
      aside={
        <div className="flex h-[200px] w-[200px] items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <span className="text-[48px]">⚡</span>
        </div>
      }
    />,

    <ProcessSlide
      key="process"
      title="Design Process"
      steps={[
        {
          title: "Stakeholder Interviews",
          description:
            "Mapped the landscape of 12+ tools being used across operations, SRE, and platform teams.",
        },
        {
          title: "Information Architecture",
          description:
            "Defined a progressive disclosure model that scales from overview to deep-dive without overwhelming.",
        },
        {
          title: "Prototyping",
          description:
            "Built interactive prototypes simulating real alert scenarios to test response flows.",
        },
        {
          title: "Usability Testing",
          description:
            "Ran sessions with on-call engineers during simulated incidents to validate the design under pressure.",
        },
      ]}
    />,

    <SplitSlide
      key="dashboard"
      left={
        <div className="flex flex-col gap-4">
          <h3 className="font-ppmondwest text-[28px] text-white">Unified Dashboard</h3>
          <p className="text-[15px] leading-[1.7] text-white/60">
            A single pane of glass bringing together alerts, metrics, system health, and team
            activity. Customizable widgets allow each user to prioritize what matters most.
          </p>
        </div>
      }
      right={
        <div className="flex h-[300px] w-full items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02]">
          <div className="grid grid-cols-2 gap-3 p-6">
            {["Alerts", "Metrics", "Health", "Activity"].map(label => (
              <div
                key={label}
                className="flex h-[80px] w-[100px] items-center justify-center rounded-lg border border-white/10 bg-white/5"
              >
                <span className="text-[11px] text-white/50">{label}</span>
              </div>
            ))}
          </div>
        </div>
      }
    />,

    <FeatureGridSlide
      key="features"
      title="Core Features"
      features={[
        {
          icon: "🔔",
          title: "Smart Alerts",
          description: "ML-powered deduplication groups related incidents and suppresses noise.",
        },
        {
          icon: "📊",
          title: "Live Metrics",
          description: "Real-time dashboards with customizable widgets for every team's needs.",
        },
        {
          icon: "🔍",
          title: "Deep Search",
          description: "Instantly query across all connected systems from a single search bar.",
        },
        {
          icon: "🤝",
          title: "Collaboration",
          description: "In-context discussion threads, assignments, and resolution tracking.",
        },
        {
          icon: "📋",
          title: "Runbooks",
          description: "Automated playbooks triggered by specific alert patterns.",
        },
        {
          icon: "🔌",
          title: "Integrations",
          description: "Connects to 40+ tools including PagerDuty, Datadog, Slack, and Jira.",
        },
      ]}
    />,

    <ContentSlide
      key="real-time"
      title="Real-Time Intelligence"
      content={
        <>
          <p>
            The system processes thousands of events per second, using intelligent filtering and
            ML-powered prioritization to surface only what requires human attention.
          </p>
          <p>
            Alert fatigue was reduced by 73% through smart grouping and de-duplication of related
            incidents.
          </p>
        </>
      }
      aside={
        <div className="flex flex-col items-center gap-3">
          <span className="font-ppmondwest text-[56px] text-white">73%</span>
          <span className="text-[13px] text-white/40">less alert fatigue</span>
        </div>
      }
    />,

    <SplitSlide
      key="collaboration"
      left={
        <div className="flex h-[250px] w-full items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="h-12 w-12 rounded-full border-2 border-[#0a0a0a] bg-white/20"
              />
            ))}
          </div>
        </div>
      }
      right={
        <div className="flex flex-col gap-4">
          <h3 className="font-ppmondwest text-[28px] text-white">Team Collaboration</h3>
          <p className="text-[15px] leading-[1.7] text-white/60">
            Built-in collaboration features allow teams to discuss, assign, and resolve incidents
            without leaving the platform. Shared context reduces mean time to resolution.
          </p>
        </div>
      }
    />,

    <QuoteSlide
      key="quote"
      quote="Command Center gave us back hours every week. We finally have one place to understand what's happening across our entire infrastructure."
      author="Platform Engineering Lead"
      role="Enterprise customer"
    />,

    <MetricsSlide
      key="metrics"
      title="Outcomes"
      metrics={[
        { value: "12→1", label: "Tools consolidated" },
        { value: "85%", label: "Less context-switching" },
        { value: "40%", label: "Faster incident response" },
        { value: "200+", label: "Daily active operators" },
      ]}
    />,
  ];

  return <LovableSlideshow slides={slides} title="Command Center" />;
}
