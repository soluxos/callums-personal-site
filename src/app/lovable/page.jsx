import Link from "next/link";

export default function LovablePage() {
  const studies = [
    {
      slug: "drupal-canvas",
      title: "Drupal Canvas",
      description: "A node-based design system editor for Drupal CMS",
    },
    {
      slug: "command-center",
      title: "Command Center",
      description: "A centralized operations dashboard",
    },
    {
      slug: "union-roasted",
      title: "Union Roasted",
      description: "E-commerce for a specialty coffee brand",
    },
    { slug: "templates", title: "Templates", description: "All available slide types and layouts" },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 bg-[#0a0a0a] px-6 py-20">
      <h1 className="font-ppmondwest text-[48px] leading-[1.2] text-white">Lovable</h1>
      <p className="max-w-[400px] text-center text-[15px] text-white/50">
        Case studies presented as interactive slide decks.
      </p>
      <div className="flex flex-col gap-4">
        {studies.map(study => (
          <Link
            key={study.slug}
            href={`/lovable/${study.slug}`}
            className="group flex flex-col gap-1 rounded-xl border border-white/10 px-8 py-5 transition-all hover:border-white/30 hover:bg-white/5"
          >
            <span className="font-ppmondwest text-[20px] text-white group-hover:text-white/90">
              {study.title}
            </span>
            <span className="text-[13px] text-white/40">{study.description}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
