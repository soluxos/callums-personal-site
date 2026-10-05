"use client";

import { useState } from "react";
import STAR_CONTENT from "@/data/starContent";

const STAR_SECTIONS = [
  { key: "situation", label: "Situation", badgeClass: "bg-[#dbeafe] text-[#1e40af]" },
  { key: "task", label: "Task", badgeClass: "bg-[#fef3c7] text-[#92400e]" },
  { key: "action", label: "Action", badgeClass: "bg-[#ede9fe] text-[#5b21b6]" },
  { key: "result", label: "Result", badgeClass: "bg-[#dcfce7] text-[#166534]" },
];

function renderContent(text, isAction) {
  if (!text) return null;

  if (isAction) {
    const lines = text.split("\n").filter(l => l.trim());
    const hasBullets = lines.some(l => /^[-•*]/.test(l.trim()));

    if (hasBullets) {
      return (
        <ul className="flex flex-col gap-1.5 list-none">
          {lines.map((line, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-[14px] font-medium leading-[1.5] text-[#656565]"
            >
              <span className="mt-[3px] shrink-0 h-[6px] w-[6px] rounded-full bg-[#929292]" />
              <span>{line.replace(/^[-•*]\s*/, "")}</span>
            </li>
          ))}
        </ul>
      );
    }
  }

  return (
    <p className="text-[14px] font-medium leading-[1.5] text-[#656565] whitespace-pre-line">
      {text}
    </p>
  );
}

export default function STARBreakdown({ caseStudyId }) {
  const [copied, setCopied] = useState(false);
  const star = STAR_CONTENT[caseStudyId];

  if (!star) return null;

  const handleCopy = () => {
    const text = STAR_SECTIONS.map(s => `${s.label}\n${star[s.key]}`).join("\n\n");
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  return (
    <section id="star-breakdown" className="flex flex-col gap-8 scroll-mt-8">
      <div className="flex flex-col gap-2 border-t border-[#dfdfdf] pt-10">
        <h2 className="font-ppmondwest text-[32px] leading-[1.25] text-[#484848]">
          STAR breakdown
        </h2>
        <p className="text-[14px] font-medium leading-[1.5] text-[#6b6b6b]">
          A short summary of the Situation, Task, Action, and Result for this case study, the key
          points I want you to remember.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          {STAR_SECTIONS.map(({ key, label, badgeClass }) => (
            <div key={key} className="flex flex-col gap-3 rounded-[8px] bg-[#ededed] p-5">
              <span
                className={`self-start rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${badgeClass}`}
              >
                {label}
              </span>
              {renderContent(star[key] ?? "", key === "action")}
            </div>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className="self-start rounded-full bg-[#0f0f0f] px-4 py-2 text-[13px] font-medium leading-[1] text-white transition-colors hover:bg-[#484848]"
        >
          {copied ? "Copied!" : "Copy all STAR text"}
        </button>
      </div>
    </section>
  );
}
