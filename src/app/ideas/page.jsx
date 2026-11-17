import IdeasCanvas from "@/components/IdeasCanvas/IdeasCanvas";
import ideas from "@/data/ideas";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Ideas · Callum Harrod",
  description: "A canvas of half-baked thoughts, sparks, and things worth remembering.",
  path: "/ideas",
});

export default function IdeasPage() {
  const isDev = process.env.NODE_ENV === "development";
  return (
    <>
      {/* The board has no visible title, so screen readers get one here. */}
      <h1 className="sr-only">Ideas</h1>
      <IdeasCanvas notes={ideas} isDev={isDev} />
    </>
  );
}
