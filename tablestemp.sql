create table if not exists public.news_items (
  id bigserial primary key,
  title text not null,
  excerpt text,
  summary text,
  image text,
  image_url text,
  date text,
  published_at timestamptz default now(),
  views text,
  view_count integer,
  category text,
  is_featured boolean default false,
  is_popular boolean default false
);

create index if not exists news_items_published_at_idx
  on public.news_items (published_at desc);

create index if not exists news_items_featured_idx
  on public.news_items (is_featured);

create index if not exists news_items_popular_idx
  on public.news_items (is_popular);
