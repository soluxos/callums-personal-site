"use client";
import { MotionConfig } from "motion/react";
import Daylight from "@/components/Daylight/Daylight";

// The wall's blue. Daylight multiplies it over the lit wall and its shade.
const WALL_BLUE = "#0057f8";

export default function SiteShell({ children }) {
  return (
    // Every page sits on the blue wall, with white text. .bluewall (globals.css) turns the
    // site's grey text classes white wherever they sit on the wall.
    <div className="bluewall relative overflow-x-clip font-satoshi text-white">
      {/* The lit wall, fixed behind the page content. */}
      <Daylight tint={WALL_BLUE} />
      {/* With reduced motion on, nothing slides or moves in; fades still play. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </div>
  );
}
