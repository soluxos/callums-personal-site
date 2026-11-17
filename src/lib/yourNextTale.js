// Server only. Data for the "Recently read" row: the books Callum finished most recently on
// Your Next Tale, his bookshelf app. The app keeps its data in the same Supabase project as this
// site, so this reads the same public rows his bookcase page does, with the publishable key.
// Returns null when Supabase can't be reached, answers in a shape we don't expect, or has too
// few books to fill the row, so the page leaves the section out instead of showing something
// wrong.

const SITE_URL = "https://yournexttale.com";
export const USERNAME = "callum";
export const BOOKCASE_URL = `${SITE_URL}/u/${USERNAME}/read`;
// The profile id behind that username. user_books has no link to profiles to filter through.
const USER_ID = "2973a639-8da5-46cf-9034-3f45acd42491";
const REVALIDATE_SECONDS = 60 * 60;

// The row shows eight books on wide screens and six on small ones.
export const MAX_BOOKS = 8;
export const MIN_BOOKS = 6;

// Book pages on Your Next Tale are addressed by title and first author. This mirrors
// generateBookSlug in that repo (src/lib/slugify.js), so keep the two in step.
const bookSlug = (title, author) =>
  `${title} ${author}`
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

// books.cover_url is a path in the public "books" bucket, or now and then a full URL. Stored
// covers go through Supabase's image resizer, at the same sizes Your Next Tale asks for
// (src/lib/covers.js there), so a 150px cover isn't a 1500px download.
function cover(path, base) {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return { src: path };
  const resized = width =>
    `${base}/storage/v1/render/image/public/books/${path}?width=${width}&height=${width * 1.5}&resize=contain&quality=75`;
  return { src: resized(480), srcSet: `${resized(240)} 240w, ${resized(480)} 480w` };
}

// The last books finished on the Read shelf, newest first.
export async function getRecentlyRead() {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key) return null;

  try {
    const query = new URLSearchParams({
      // The inner joins keep only books that sit on the Read shelf.
      select:
        "date_finished,books(id,title,authors,cover_url),bookshelf_books!inner(bookshelves!inner(slug))",
      user_id: `eq.${USER_ID}`,
      "bookshelf_books.bookshelves.slug": "eq.read",
      date_finished: "not.is.null",
      order: "date_finished.desc,created_at.desc",
      limit: String(MAX_BOOKS),
    });
    const res = await fetch(`${base}/rest/v1/user_books?${query}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const rows = await res.json();
    if (!Array.isArray(rows)) return null;

    const books = rows.flatMap(({ date_finished: finished, books: book }) => {
      const image = cover(book?.cover_url, base);
      if (!book?.id || !book.title || !image) return [];
      const authors = Array.isArray(book.authors) ? book.authors.filter(Boolean) : [];
      return [
        {
          id: book.id,
          title: book.title,
          author: authors.join(", "),
          finished,
          url: `${SITE_URL}/books/${bookSlug(book.title, authors[0])}`,
          cover: image,
        },
      ];
    });
    return books.length >= MIN_BOOKS ? books : null;
  } catch {
    return null;
  }
}
