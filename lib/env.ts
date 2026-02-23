const DEFAULT_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(rawUrl: string | undefined): string {
  if (!rawUrl) {
    return DEFAULT_SITE_URL;
  }

  try {
    return new URL(rawUrl).origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const env = {
  siteUrl: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
};

export function hasSupabaseConfig(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}
