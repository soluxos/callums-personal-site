"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const CHAR_MS = 28; // ms per character typed
const PAUSE_AFTER_MS = 600; // pause after a message finishes before next appears

// Message definitions — side: "left" | "right", text is what gets typed out.
// For the photo message, text is the caption; photos always appear instantly with the bubble.
const MESSAGES = [
  { side: "left", text: "Hey Callum, what're you up to?" },
  {
    side: "right",
    text: "Well, I've been working on this site a fair bit recently. Other than that, I've been working on Your Next Tale.\n\nOutside of this I've been reading a fair amount, playing some games, and exploring with my wife, Dawn. Oh I've also been taking a lot of photos, that's always pretty neat.",
  },
  { side: "left", text: "Oh sweet! Any you want to share?" },
  { side: "right", text: "Oh yeah, check these out!", hasPhotos: true },
  { side: "left", text: "Oh neat. So how did you get into design and development?" },
  {
    side: "right",
    text: "I've always been a massive nerd. Ever since I was old enough to play video games I have. This led to me getting a laptop eventually at 11. At this point I started messing around with programming, and creating stuff digitally.\n\nThen at school I did some cool stuff like creating websites to play flash games that were blocked by the major sites at school. Creating websites little side projects. Oh and for some reason I learned how to write my name using binary (I have no idea why, but I can do it if you want me to). From there I just kept on learning and doing more and more cool stuff.",
  },
];

function LeftTail() {
  return (
    <svg
      className="absolute -bottom-[6px] left-[16px]"
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
    >
      <path d="M0 0L10 0L0 6Z" fill="#ededed" />
    </svg>
  );
}

function RightTail({ color = "#0090ff" }) {
  return (
    <svg
      className="absolute -bottom-[6px] right-[16px]"
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
    >
      <path d="M10 0L0 0L10 6Z" fill={color} />
    </svg>
  );
}

// Renders text with \n\n as paragraph breaks
function TypedText({ text, typedLen, isTyping, textClass }) {
  const displayed = text.slice(0, typedLen);
  const parts = displayed.split("\n\n");
  return (
    <>
      {parts.map((part, i) => (
        <p
          key={i}
          className={textClass}
          style={{ margin: 0, marginBottom: i < parts.length - 1 ? 14 : 0 }}
        >
          {part}
          {i === parts.length - 1 && isTyping && <span className="about-chat-cursor" aria-hidden />}
        </p>
      ))}
    </>
  );
}

export default function AboutChat() {
  // visibleCount = how many bubbles are mounted in the DOM
  const [visibleCount, setVisibleCount] = useState(0);
  // typedLengths[i] = how many chars of message i have been typed
  const [typedLengths, setTypedLengths] = useState(Array(MESSAGES.length).fill(0));
  const timerRef = useRef(null);

  function clearTimer() {
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  function skipAll() {
    clearTimer();
    setVisibleCount(MESSAGES.length);
    setTypedLengths(MESSAGES.map(m => m.text.length));
  }

  const isDone =
    visibleCount >= MESSAGES.length &&
    typedLengths[MESSAGES.length - 1] >= MESSAGES[MESSAGES.length - 1].text.length;

  useEffect(() => {
    // Kick off: show the first bubble after a short initial delay
    timerRef.current = setTimeout(() => setVisibleCount(1), 300);
    return clearTimer;
  }, []);

  useEffect(() => {
    if (visibleCount === 0) return;
    const idx = visibleCount - 1; // index of the currently-typing bubble
    const msg = MESSAGES[idx];
    const typed = typedLengths[idx];

    clearTimer();

    if (typed < msg.text.length) {
      // Keep typing current message
      timerRef.current = setTimeout(() => {
        setTypedLengths(prev => {
          const next = [...prev];
          next[idx] = prev[idx] + 1;
          return next;
        });
      }, CHAR_MS);
    } else if (idx < MESSAGES.length - 1) {
      // Current message finished — pause then reveal next bubble
      timerRef.current = setTimeout(() => {
        setVisibleCount(c => c + 1);
      }, PAUSE_AFTER_MS);
    }

    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleCount, typedLengths]);

  return (
    <>
      <style>{`
        @keyframes about-cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .about-chat-cursor {
          display: inline-block;
          width: 1.5px;
          height: 0.9em;
          background: currentColor;
          vertical-align: text-bottom;
          margin-left: 1px;
          opacity: 0.7;
          animation: about-cursor-blink 530ms step-start infinite;
        }
      `}</style>

      <div className="flex flex-col gap-5 max-w-[710px]">
        {!isDone && (
          <button
            onClick={skipAll}
            className="self-start font-satoshi text-[12px] font-medium text-[#b0b0b0] hover:text-[#656565] transition-colors cursor-pointer bg-none border-none p-0 underline underline-offset-2"
          >
            Skip (the layout shift is really annoying)
          </button>
        )}
        {MESSAGES.slice(0, visibleCount).map((msg, idx) => {
          const typed = typedLengths[idx];
          const isTyping = typed < msg.text.length;
          const isLeft = msg.side === "left";

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                opacity: { duration: 0.18 },
                scale: { type: "spring", stiffness: 400, damping: 24, mass: 0.8 },
                y: { type: "spring", stiffness: 400, damping: 24, mass: 0.8 },
              }}
            >
              {isLeft ? (
                <div className="flex flex-col items-start">
                  <div className="relative bg-[#ededed] rounded-[8px] px-4 py-2 max-w-[467px]">
                    <TypedText
                      text={msg.text}
                      typedLen={typed}
                      isTyping={isTyping}
                      textClass="font-satoshi text-[14px] font-medium leading-[1.25] text-[#656565]"
                    />
                    <LeftTail />
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <div className="flex flex-col gap-2 items-end">
                    {msg.hasPhotos && (
                      <div className="max-w-[467px] grid grid-cols-2 gap-0 pt-[10px]">
                        <img
                          src="/images/random/37.jpg"
                          alt="Photo 1"
                          className="object-cover h-[120px] w-full rounded-tl-lg"
                        />
                        <img
                          src="/images/about/image-2.jpg"
                          alt="Photo 2"
                          className="object-cover h-[120px] w-full rounded-tr-lg"
                        />
                        <img
                          src="/images/random/2.jpg"
                          alt="Photo 3"
                          className="object-cover h-[120px] w-full rounded-bl-lg"
                        />
                        <img
                          src="/images/random/26.jpg"
                          alt="Photo 4"
                          className="object-cover h-[120px] w-full rounded-br-lg"
                        />
                      </div>
                    )}
                    <div className="relative bg-[#0090ff] rounded-[8px] px-4 py-2 max-w-[467px] self-end">
                      <TypedText
                        text={msg.text}
                        typedLen={typed}
                        isTyping={isTyping}
                        textClass="font-satoshi text-[14px] font-medium leading-[1.25] text-white"
                      />
                      <RightTail />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
