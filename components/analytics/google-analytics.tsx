"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { analyticsConfig, isGoogleAnalyticsEnabled } from "@/lib/analytics/config";
import { trackPageView } from "@/lib/analytics/service";

export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const hasTrackedInitialPage = useRef(false);

  useEffect(() => {
    if (!isGoogleAnalyticsEnabled()) {
      return;
    }

    if (!hasTrackedInitialPage.current) {
      hasTrackedInitialPage.current = true;
      return;
    }

    const path = queryString ? `${pathname}?${queryString}` : pathname;
    trackPageView(path);
  }, [pathname, queryString]);

  if (!isGoogleAnalyticsEnabled()) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.gaMeasurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          window.gtag('js', new Date());
          window.gtag('config', '${analyticsConfig.gaMeasurementId}', { send_page_view: true });
        `}
      </Script>
    </>
  );
}
