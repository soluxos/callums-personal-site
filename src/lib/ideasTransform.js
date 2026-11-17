// Shared motion values for the Ideas canvas pan/zoom transform.
// IdeasCanvas writes them; anything else that needs the canvas's pan and zoom can read them
// from here without prop-drilling or context.
import { motionValue } from "motion/react";

export const canvasPanX = motionValue(0);
export const canvasPanY = motionValue(0);
export const canvasZoom = motionValue(1);
