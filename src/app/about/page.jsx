import Image from "next/image";

export default function About() {
  return (
    <main className="flex flex-col gap-[120px]">
      <section className="w-full max-w-[591px]">
        <div className="space-y-4 text-[14px] font-medium leading-[1.5] text-[#656565]">
          <p>
            Originally I started out with development, as I wanted to bring my ideas to life. I
            quickly faced the reality that if I ever wanted to make something successful, it would
            have to not only work (duh) but it would have to look great, and feel as intuitive as
            possible to use.
          </p>
          <p>
            Since then I’ve been on a journey of both design and development. In my job roles I’ve
            had to handle everything from design, development, marketing, and more.
          </p>
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
          "/images/about/image-1.jpg",
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
