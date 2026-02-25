const compactFormatter = new Intl.NumberFormat("uk-UA", {
  notation: "compact",
  maximumFractionDigits: 1
});

const dateFormatter = new Intl.DateTimeFormat("uk-UA", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
});

const compactDateFormatter = new Intl.DateTimeFormat("uk-UA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
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
    return "Невідома дата";
  }

  return dateFormatter.format(parsed);
}

export function formatPublishedDateCompact(value: string): string {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Невідома дата";
  }

  return compactDateFormatter.format(parsed);
}
