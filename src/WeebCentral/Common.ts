export const BASE_URL = "https://weebcentral.com";

export const buildSearchUrl = (query: string): string => {
    return `${BASE_URL}/search/data?text=${encodeURIComponent(query.trim())}`;
};

export const buildMangaUrl = (mangaId: string): string => {
    return `${BASE_URL}/series/${mangaId}`;
};

export const normalizeUrl = (value?: string | null): string | undefined => {
    if (!value) {
        return undefined;
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return undefined;
    }

    if (trimmed.startsWith("//")) {
        return `https:${trimmed}`;
    }

    if (trimmed.startsWith("/")) {
        return `${BASE_URL}${trimmed}`;
    }

    try {
        return new URL(trimmed, BASE_URL).toString();
    } catch {
        return undefined;
    }
};

export const extractText = (value?: string | null): string => {
    if (!value) {
        return "";
    }

    return value.replace(/\s+/g, " ").trim();
};
