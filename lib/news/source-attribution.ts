const SOURCE_LABEL_PATTERN = "(?:source|\\u0434\\u0436\\u0435\\u0440\\u0435\\u043b\\u043e)";
const TRAILING_SOURCE_BLOCK_RE = new RegExp(
  `(?:\\n{1,2}|\\s+)${SOURCE_LABEL_PATTERN}\\s*:\\s*(https?:\\/\\/\\S+)\\s*$`,
  "iu"
);
const TRAILING_URL_PUNCTUATION_RE = /[)\],.;!?]+$/u;

export type SplitSummaryResult = {
  summary: string;
  sourceAttributionUrl: string | null;
};

function normalizeHttpUrl(rawValue: string | null | undefined): string | null {
  const normalized = (rawValue ?? "").trim().replace(TRAILING_URL_PUNCTUATION_RE, "");
  if (!normalized) {
    return null;
  }

  try {
    const parsed = new URL(normalized);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

function stripTrailingSourceBlocks(summary: string): SplitSummaryResult {
  let remaining = summary.trim();
  let extractedSourceUrl: string | null = null;

  while (remaining.length > 0) {
    const match = remaining.match(TRAILING_SOURCE_BLOCK_RE);
    if (!match || match.index === undefined) {
      break;
    }

    const maybeSourceUrl = normalizeHttpUrl(match[1] ?? "");
    if (!extractedSourceUrl && maybeSourceUrl) {
      extractedSourceUrl = maybeSourceUrl;
    }

    remaining = remaining.slice(0, match.index).trimEnd();
  }

  return {
    summary: remaining.trim(),
    sourceAttributionUrl: extractedSourceUrl,
  };
}

export function splitSummaryAndSourceAttribution(
  summary: string,
  sourceUrlFallback: string | null | undefined,
): SplitSummaryResult {
  const normalizedSummary = summary.trim();
  const extracted = stripTrailingSourceBlocks(normalizedSummary);
  const fallbackSource = normalizeHttpUrl(sourceUrlFallback);

  return {
    summary: extracted.summary,
    sourceAttributionUrl: extracted.sourceAttributionUrl ?? fallbackSource,
  };
}
