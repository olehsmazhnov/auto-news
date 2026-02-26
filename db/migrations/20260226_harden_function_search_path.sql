begin;

do $$
begin
  if to_regprocedure('public.slugify_uk(text)') is not null then
    execute $sql$alter function public.slugify_uk(text) set search_path = ''$sql$;
    execute $sql$revoke all on function public.slugify_uk(text) from public$sql$;
  end if;

  if to_regprocedure('public.news_items_set_slug()') is not null then
    execute $sql$alter function public.news_items_set_slug() set search_path = ''$sql$;
    execute $sql$revoke all on function public.news_items_set_slug() from public$sql$;
  end if;

  if to_regprocedure('public.news_items_set_updated_at()') is not null then
    execute $sql$alter function public.news_items_set_updated_at() set search_path = ''$sql$;
    execute $sql$revoke all on function public.news_items_set_updated_at() from public$sql$;
  end if;

  if to_regprocedure('public.get_news_category_counts()') is not null then
    execute $sql$alter function public.get_news_category_counts() set search_path = ''$sql$;
    execute $sql$revoke all on function public.get_news_category_counts() from public$sql$;
    execute $sql$grant execute on function public.get_news_category_counts() to anon, authenticated$sql$;
  end if;
end
$$;

commit;
