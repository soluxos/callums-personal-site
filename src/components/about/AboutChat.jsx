// The About page conversation. Every message is on the page from the start, with
// no typing animation and no scrolling box, so it reads like the rest of the page.

const MESSAGES = [
  { side: "left", text: "Hey Callum, what're you up to?" },
  {
    side: "right",
    text: "Well, I've been working on this site a fair bit recently. Other than that, I've been working on Your Next Tale.\n\nOutside of this I've been reading a fair amount, playing some games, and exploring with my wife, Dawn. Oh, I've also been taking a lot of photos, that's always pretty neat.",
  },
  { side: "left", text: "Oh sweet! Any you want to share?" },
  {
    side: "right",
    text: "Oh yeah, check these out!",
    photos: [
      ["/images/random/37.jpg", "A field seen between two tree trunks on a sunny day"],
      ["/images/about/image-2.jpg", "A row of old shopfronts on a narrow street"],
      ["/images/random/2.jpg", "People walking across a paved square in front of a glass building"],
      ["/images/random/26.jpg", "A colourful mural reading Creativity is in all of us"],
    ],
  },
  { side: "left", text: "Oh neat. So how did you get into design and development?" },
  {
    side: "right",
    text: "I've always been a massive nerd. Ever since I was old enough to play video games I have. This led to me getting a laptop eventually at 11. At this point I started messing around with programming, and creating stuff digitally.\n\nThen at school I did some cool stuff like creating websites to play flash games that were blocked by the major sites at school. Creating websites and little side projects. Oh, and for some reason I learned how to write my name using binary (I have no idea why, but I can do it if you want me to). From there I just kept on learning and doing more and more cool stuff.",
  },
];

const PHOTO_CORNERS = ["rounded-tl-lg", "rounded-tr-lg", "rounded-bl-lg", "rounded-br-lg"];

function Tail({ side }) {
  const left = side === "left";
  return (
    <svg
      aria-hidden="true"
      className={`absolute -bottom-[6px] ${left ? "left-[16px]" : "right-[16px]"}`}
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
    >
      <path d={left ? "M0 0L10 0L0 6Z" : "M10 0L0 0L10 6Z"} fill={left ? "#DDDDDD" : "#0090ff"} />
    </svg>
  );
}

function Paragraphs({ text, className }) {
  return text.split("\n\n").map((part, i) => (
    <p key={i} className={`${className} [&:not(:last-child)]:mb-[14px]`}>
      {part}
    </p>
  ));
}

export default function AboutChat() {
  return (
    <div className="flex flex-col gap-4">
      {MESSAGES.map((msg, i) =>
        msg.side === "left" ? (
          <div key={i} className="flex flex-col items-start">
            <div className="relative max-w-[467px] rounded-[8px] bg-[#DDDDDD] px-4 py-2">
              <Paragraphs
                text={msg.text}
                className="font-satoshi text-[14px] font-medium leading-[1.25] text-[#555555]"
              />
              <Tail side="left" />
            </div>
          </div>
        ) : (
          <div key={i} className="flex justify-end">
            <div className="flex max-w-[467px] flex-col items-end gap-2">
              {msg.photos && (
                <div className="grid w-full grid-cols-2 pt-[10px]">
                  {msg.photos.map(([src, alt], j) => (
                    <img
                      key={src}
                      src={src}
                      alt={alt}
                      className={`h-[120px] w-full object-cover ${PHOTO_CORNERS[j]}`}
                    />
                  ))}
                </div>
              )}
              <div className="relative self-end rounded-[8px] bg-[#0090ff] px-4 py-2">
                <Paragraphs
                  text={msg.text}
                  className="font-satoshi text-[14px] font-medium leading-[1.25] text-white"
                />
                <Tail side="right" />
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
