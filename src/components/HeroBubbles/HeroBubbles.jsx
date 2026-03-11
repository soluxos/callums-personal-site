"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

const CHAR_MS = 38; // ms per character while typing
const PAUSE_MS = 4000; // pause after fully typed before exiting

const BUBBLE_GAP_MOBILE = 0; // px on small screens
const BUBBLE_GAP_DESKTOP = 80; // px on larger screens

// ↔ Maximum width of a speech bubble before text wraps to a new line.
const BUBBLE_MAX_WIDTH = 320; // px

function BubbleTail({ side }) {
  return (
    <svg
      width="8"
      height="6"
      viewBox="0 0 8 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        bottom: -6,
        ...(side === "left" ? { left: 14 } : { right: 14 }),
      }}
    >
      <path d="M0 0 L4 6 L8 0 Z" fill="#0090ff" />
    </svg>
  );
}

const textStyle = {
  color: "#fff",
  fontSize: 14,
  fontFamily: "var(--font-satoshi), Satoshi, sans-serif",
  fontWeight: 500,
  lineHeight: 1.25,
};

export default function HeroBubbles({ messages }) {
  const [index, setIndex] = useState(0);
  // phases: typing | pausing | exiting
  const [phase, setPhase] = useState("typing");
  const [typedLen, setTypedLen] = useState(0);
  const [visible, setVisible] = useState(true);
  const [bubbleGap, setBubbleGap] = useState(BUBBLE_GAP_DESKTOP);
  const timerRef = useRef(null);

  useEffect(() => {
    function updateGap() {
      setBubbleGap(window.innerWidth < 768 ? BUBBLE_GAP_MOBILE : BUBBLE_GAP_DESKTOP);
    }
    updateGap();
    window.addEventListener("resize", updateGap);
    return () => window.removeEventListener("resize", updateGap);
  }, []);

  const msg = messages[index];
  // Automatically alternate: even index = left, odd index = right
  const side = index % 2 === 0 ? "left" : "right";
  const tailSide = side === "left" ? "right" : "left";
  const fullText = msg.text ?? msg;

  function clearTimer() {
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  useEffect(() => {
    clearTimer();
    if (phase === "typing") {
      if (typedLen < fullText.length) {
        timerRef.current = setTimeout(() => setTypedLen(n => n + 1), CHAR_MS);
      } else {
        timerRef.current = setTimeout(() => setPhase("pausing"), 60);
      }
    } else if (phase === "pausing") {
      timerRef.current = setTimeout(() => {
        setVisible(false);
        setPhase("exiting");
      }, PAUSE_MS);
    }
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, typedLen]);

  function handleExitComplete() {
    setIndex(i => (i + 1) % messages.length);
    setTypedLen(0);
    setPhase("typing");
    setVisible(true);
  }

  return (
    <>
      <style>{`
        @keyframes hb-cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .hb-cursor {
          display: inline-block;
          width: 1.5px;
          height: 1em;
          background: rgba(255,255,255,0.85);
          vertical-align: text-bottom;
          margin-left: 1px;
          animation: hb-cursor-blink 530ms step-start infinite;
        }
      `}</style>

      <div
        style={{
          position: "relative",
          width: "min(780px, 100vw)",
          height: 50,
        }}
      >
        <AnimatePresence onExitComplete={handleExitComplete}>
          {visible && (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.7, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.75, y: 10 }}
              transition={{
                // entrance: springy iMessage pop
                opacity: { duration: 0.18 },
                scale: { type: "spring", stiffness: 420, damping: 22, mass: 0.8 },
                y: { type: "spring", stiffness: 420, damping: 22, mass: 0.8 },
              }}
              style={{
                position: "absolute",
                bottom: 0,
                // left bubble: anchor right edge at BUBBLE_GAP from centre, grows leftward
                // right bubble: anchor left edge at BUBBLE_GAP from centre, grows rightward
                ...(side === "left"
                  ? {
                      right: `calc(50% + ${bubbleGap}px)`,
                      maxWidth: `calc(50% - ${bubbleGap}px - 20px)`,
                    }
                  : {
                      left: `calc(50% + ${bubbleGap}px)`,
                      maxWidth: `calc(50% - ${bubbleGap}px - 20px)`,
                    }),
                display: "inline-flex",
                alignItems: "center",
                minHeight: 34,
                backgroundColor: "#0090ff",
                borderRadius: 8,
                padding: "8px 16px",
                wordBreak: "break-word",
                transformOrigin: side === "left" ? "bottom right" : "bottom left",
              }}
            >
              <span style={{ ...textStyle, textAlign: "left", display: "block" }}>
                {fullText.slice(0, typedLen)}
                {phase === "typing" && <span className="hb-cursor" aria-hidden />}
              </span>
              <BubbleTail side={tailSide} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
