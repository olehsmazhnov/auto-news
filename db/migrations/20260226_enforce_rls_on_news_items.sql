begin;

alter table public.news_items enable row level security;
alter table public.news_items force row level security;

drop policy if exists news_items_public_read on public.news_items;
create policy news_items_public_read
on public.news_items
for select
to anon, authenticated
using (true);

revoke all on table public.news_items from public;
revoke all on table public.news_items from anon, authenticated;
grant select on table public.news_items to anon, authenticated;

commit;
