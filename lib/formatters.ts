const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric"
});

export function formatViewCount(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return "0";
  }

  return compactFormatter.format(value);
}

export function formatPublishedDate(value: string): string {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Unknown date";
  }

  return dateFormatter.format(parsed);
}
