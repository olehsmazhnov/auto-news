import { notFound, permanentRedirect } from "next/navigation";
import { getNewsById } from "@/lib/news/news-repository";
import { parseLegacyNewsIdFromSlug, toNewsSlug } from "@/lib/news/slug";

type LegacyNewsPageProps = {
  params: Promise<{
    legacySlug: string;
  }>;
};

export default async function LegacyNewsPage({ params }: LegacyNewsPageProps) {
  const { legacySlug } = await params;

  // Handle only malformed legacy root links like "/-title--17".
  if (!legacySlug.startsWith("-")) {
    notFound();
  }

  const id = parseLegacyNewsIdFromSlug(legacySlug);

  if (!id) {
    notFound();
  }

  const article = await getNewsById(id);

  if (!article) {
    notFound();
  }

  permanentRedirect(`/news/${toNewsSlug(article)}`);
}
