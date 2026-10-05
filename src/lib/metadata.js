// Page titles, descriptions and link previews. A page that sets only a title still
// shares the homepage's preview text, because Next replaces the whole openGraph
// object rather than merging it, so every page builds its metadata here.

export const SITE_URL = "https://callumharrod.com";
export const SHARE_IMAGE = `${SITE_URL}/images/social-share.png`;
const SHARE_IMAGE_ALT =
  "Callum Harrod, design lead and design engineer: Drupal Canvas, Acquia Source, Acquia AI and Site Studio";

export function pageMetadata({ title, description, path = "" }) {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      siteName: "Callum Harrod",
      type: "website",
      images: [{ url: SHARE_IMAGE, width: 1200, height: 630, alt: SHARE_IMAGE_ALT }],
    },
    twitter: { card: "summary_large_image", title, description, images: [SHARE_IMAGE] },
  };
}
