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

      <section className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`about-card-${index}`}
            className="h-[480px] w-full rounded-[16px] bg-[#ededed]"
          />
        ))}
      </section>
    </main>
  );
}
