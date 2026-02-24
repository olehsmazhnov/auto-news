const rawGaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const analyticsConfig = {
  gaMeasurementId: rawGaMeasurementId?.trim() ?? ""
};

export function isGoogleAnalyticsEnabled(): boolean {
  return Boolean(analyticsConfig.gaMeasurementId);
}
