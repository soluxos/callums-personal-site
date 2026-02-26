import Image from "next/image";

export default function About() {
  return (
    <main className="flex flex-col gap-[80px]">
      <section className="w-full max-w-full">
        <div className="space-y-4 text-[14px] font-medium leading-[1.5] text-[#656565]">
          <h1 className="w-full max-w-[591px] font-ppmondwest text-[48px] leading-[1.25]">
            A little bit about me
          </h1>
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-4 text-[14px] font-medium leading-[1.5] text-[#656565]">
              <p>
                Hey, thanks for checking my about page out! So, a bit about me. I&apos;m someone
                that has always loved tech. When I was around 10, I got my first laptop. Very
                quickly I was messing about trying to make my own applications and websites. Ever
                since then I knew that I wanted to work with computers. From that point I carried on
                nerding out about how things were made so that I could do it myself.
              </p>
              <p>
                I like to think that I sit pretty evenly between design and development. I have a
                strong technical background, but I also know that to make anything good, it needs to
                look and feel good to use too.
              </p>
            </div>
            <div className="space-y-4 text-[14px] font-medium leading-[1.5] text-[#656565]">
              <p>
                Outside of being a nerd and making stuff, I'm a huge gamer and spend far too long
                playing games, and keeping up with gaming news. I love to read fantasy and sci-fi
                books. I also love exploring the world with my wife!
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div
          key={`about-card`}
          className="relative h-[480px] w-full rounded-[16px] overflow-hidden col-span-1 md:col-span-2 lg:col-span-4"
        >
          <Image
            src="/images/about/hero.jpg"
            alt={`About image`}
            fill
            className="object-cover h-[480px] w-full rounded-[16px]"
            sizes="(max-width: 1024px) 50vw, 25vw"
            quality={90}
          />
        </div>
        {[
          "/images/about/image-37.jpg",
          "/images/about/image-2.jpg",
          "/images/random/38.jpg",
          "/images/random/11.jpg",
          "/images/about/image-4.jpg",
          "/images/random/1.jpg",
          "/images/random/2.jpg",
          "/images/random/6.jpg",
        ].map((src, index) => (
          <div
            key={`about-card-${index}`}
            className="relative h-[480px] w-full rounded-[16px] overflow-hidden"
          >
            <Image
              src={src}
              alt={`About image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 25vw"
              quality={100}
            />
          </div>
        ))}
      </section>
    </main>
  );
}
