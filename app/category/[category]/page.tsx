import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { DEFAULT_NEWS_CATEGORY } from "@/lib/news/constants";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export const revalidate = 120;

export async function generateMetadata(_: CategoryPageProps): Promise<Metadata> {
  return {
    title: `Стрічка ${DEFAULT_NEWS_CATEGORY}`,
    description: "Останні автомобільні новини.",
    alternates: {
      canonical: "/",
    },
  };
}

export default async function CategoryPage(_: CategoryPageProps) {
  permanentRedirect("/");
}
