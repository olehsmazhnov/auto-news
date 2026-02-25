export type CategoryCount = {
  category: string;
  count: number;
};

export type NewsItem = {
  id: number;
  slug?: string;
  title: string;
  excerpt: string;
  summary: string;
  sourceAttributionUrl?: string | null;
  imageUrl: string;
  publishedAt: string;
  viewsLabel: string;
  viewCount: number;
  category: string;
  isFeatured: boolean;
  isPopular: boolean;
};
