// Server component. A row of the books Callum finished most recently, read live from his Read
// shelf on Your Next Tale: eight covers on wide screens, six on small ones, each linking to the
// book's page there. Used on the home page. Data comes from src/lib/yourNextTale.js, and it
// renders nothing if the shelf can't be read.

import FadeInUp from "@/components/FadeInUp/FadeInUp";
import { BOOKCASE_URL, MIN_BOOKS, getRecentlyRead } from "@/lib/yourNextTale";

export default async function RecentlyRead() {
  const books = await getRecentlyRead();
  if (!books) return null;

  return (
    <FadeInUp>
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-ppmondwest text-[24px] leading-[1.25]">Recently read</h2>
          <a
            href={BOOKCASE_URL}
            className="shrink-0 text-[13px] font-medium text-[#6b6b6b] transition-colors hover:text-[#2a2a2a]"
          >
            View on Your Next Tale →
          </a>
        </div>

        {/* Three across on phones (six books), four from sm (eight, in two rows), then all
            eight in one row from lg. */}
        <ul className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-5 lg:grid-cols-8">
          {books.map((book, i) => (
            <li key={book.id} className={`min-w-0 ${i >= MIN_BOOKS ? "hidden sm:block" : ""}`}>
              <a href={book.url} className="group flex flex-col gap-3">
                {/* Covers vary a little in shape, so each is cropped to the same 2:3. */}
                <div className="aspect-[2/3] overflow-hidden rounded-[4px] bg-black/10 shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-transform duration-200 ease-out group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                  {/* The title and author are in the text below, so the cover needs no alt. */}
                  <img
                    src={book.cover.src}
                    srcSet={book.cover.srcSet}
                    sizes="(min-width: 1024px) 12vw, (min-width: 640px) 24vw, 31vw"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="line-clamp-2 text-[13px] font-medium leading-[1.4] text-[#2a2a2a]">
                    {book.title}
                  </p>
                  {book.author && (
                    <p className="truncate text-[12px] font-medium leading-[1.4] text-[#6b6b6b]">
                      {book.author}
                    </p>
                  )}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </FadeInUp>
  );
}
