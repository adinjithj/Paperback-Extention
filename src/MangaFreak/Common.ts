export const BASE_URL = "https://ww2.mangafreak.me";
export const WEBSITE_BASE_URL = `${BASE_URL}/`;

export const buildSearchUrl = (query: string, page: number): string => {
    const encodedQuery = encodeURIComponent(query.trim());
    const pageParam = page > 1 ? `?page=${page}` : "";
    return `${BASE_URL}/Find/${encodedQuery}${pageParam}`;
};

export const buildMangaUrl = (mangaId: string): string => {
    const normalized = normalizeMangaId(mangaId);
    if (!normalized) {
        return new URL(mangaId, WEBSITE_BASE_URL).toString();
    }

    return new URL(normalized, WEBSITE_BASE_URL).toString();
};

export const normalizeUrl = (value?: string | null): string | undefined => {
    if (!value) {
        return undefined;
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return undefined;
    }

    try {
        return new URL(trimmed, WEBSITE_BASE_URL).toString();
    } catch {
        return undefined;
    }
};

export const normalizeMangaId = (value?: string | null): string | undefined => {
    if (!value) {
        return undefined;
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return undefined;
    }

    try {
        const url = new URL(trimmed, WEBSITE_BASE_URL);
        const match = url.pathname.match(/\/Manga\/[^/?#]+/i);
        if (!match) {
            return undefined;
        }

        const normalized = match[0].replace(/^\/manga\//i, "/Manga/");
        return normalized.endsWith("/")
            ? normalized.slice(0, normalized.length - 1)
            : normalized;
    } catch {
        return undefined;
    }
};

export const parseMangaStatusEnum = (
    value?: string | null
): "ONGOING" | "COMPLETED" | "UNKNOWN" => {
    if (!value) {
        return "UNKNOWN";
    }

    const normalized = value.trim().toLowerCase();
    if (!normalized) {
        return "UNKNOWN";
    }

    if (normalized.includes("on-going") || normalized.includes("ongoing")) {
        return "ONGOING";
    }

    if (normalized.includes("completed") || normalized.includes("complete")) {
        return "COMPLETED";
    }

    return "UNKNOWN";
};

export const extractText = (value?: string | null): string => {
    if (!value) {
        return "";
    }

    return value.replace(/\s+/g, " ").trim();
};

export const extractNumber = (value?: string | null): number | undefined => {
    if (!value) {
        return undefined;
    }

    const match = value.match(/\d+(?:\.\d+)?/);
    if (!match) {
        return undefined;
    }

    const parsed = Number(match[0]);
    return Number.isNaN(parsed) ? undefined : parsed;
};

export const extractChapterId = (value?: string | null): string | undefined => {
    if (!value) {
        return undefined;
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return undefined;
    }

    try {
        const url = new URL(trimmed, WEBSITE_BASE_URL);
        return url.pathname.startsWith("/") ? url.pathname : `/${url.pathname}`;
    } catch {
        return undefined;
    }
};
