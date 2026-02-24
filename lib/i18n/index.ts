import uk from "./uk.json";
import en from "./en.json";

export type Locale = "uk" | "en";

export const translations = {
    uk,
    en
} as const;

export type Translations = typeof uk;

export const defaultLocale: Locale = "uk";

export const locales: Locale[] = ["uk", "en"];

export const localeNames: Record<Locale, string> = {
    uk: "Українська",
    en: "English"
};

type NestedKeyOf<T> = T extends object
    ? {
        [K in keyof T]: K extends string
        ? T[K] extends object
        ? `${K}.${NestedKeyOf<T[K]>}`
        : K
        : never;
    }[keyof T]
    : never;

export type TranslationKey = NestedKeyOf<Translations>;

function getNestedValue(obj: Record<string, unknown>, path: string): string {
    const keys = path.split(".");
    let current: unknown = obj;

    for (const key of keys) {
        if (current && typeof current === "object" && key in current) {
            current = (current as Record<string, unknown>)[key];
        } else {
            return path;
        }
    }

    return typeof current === "string" ? current : path;
}

export function getTranslation(locale: Locale, key: string, params?: Record<string, string | number>): string {
    const translation = getNestedValue(translations[locale] as unknown as Record<string, unknown>, key);

    if (!params) {
        return translation;
    }

    return translation.replace(/\{(\w+)\}/g, (_, paramKey) => {
        return params[paramKey]?.toString() ?? `{${paramKey}}`;
    });
}

export function createTranslator(locale: Locale) {
    return function t(key: string, params?: Record<string, string | number>): string {
        return getTranslation(locale, key, params);
    };
}
