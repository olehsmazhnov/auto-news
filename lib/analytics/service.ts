import { analyticsConfig, isGoogleAnalyticsEnabled } from "@/lib/analytics/config";

export type AnalyticsEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function canTrackInBrowser(): boolean {
  return (
    isGoogleAnalyticsEnabled() &&
    typeof window !== "undefined" &&
    typeof window.gtag === "function"
  );
}

export function trackPageView(path: string): void {
  if (!canTrackInBrowser()) {
    return;
  }

  window.gtag!("config", analyticsConfig.gaMeasurementId, {
    page_path: path
  });
}

export function trackEvent(eventName: string, params: AnalyticsEventParams = {}): void {
  if (!canTrackInBrowser()) {
    return;
  }

  window.gtag!("event", eventName, params);
}
