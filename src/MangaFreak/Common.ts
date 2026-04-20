export const BASE_URL = "https://ww2.mangafreak.me";
export const WEBSITE_BASE_URL = `${BASE_URL}/`;

export const buildSearchUrl = (query: string, page: number): string => {
    const encodedQuery = encodeURIComponent(query.trim());
    const pageParam = page > 1 ? `?page=${page}` : "";
    return `${BASE_URL}/Find/${encodedQuery}${pageParam}`;
};
