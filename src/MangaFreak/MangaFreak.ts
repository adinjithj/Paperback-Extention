import {
    Chapter,
    ChapterDetails,
    ContentRating,
    Manga,
    MangaTile,
    PagedResults,
    SearchRequest,
    Source,
    SourceInfo,
    TagType,
} from "paperback-extensions-common";
import { buildSearchUrl, WEBSITE_BASE_URL } from "./Common";

export const MangaFreakInfo: SourceInfo = {
    version: "1.0.0",
    name: "MangaFreak",
    icon: "icon.png",
    author: "OpenCode",
    description: "MangaFreak search source",
    contentRating: ContentRating.MATURE,
    websiteBaseURL: WEBSITE_BASE_URL,
    sourceTags: [
        {
            text: "Search only",
            type: TagType.YELLOW,
        },
    ],
};

const normalizeUrl = (value?: string | null): string | undefined => {
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

const normalizeMangaId = (value?: string | null): string | undefined => {
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

export class MangaFreak extends Source {
    override requestManager = createRequestManager({
        requestsPerSecond: 2,
        requestTimeout: 20000,
    });

    override async getMangaDetails(mangaId: string): Promise<Manga> {
        throw new Error(
            `MangaFreak is search-only. Details unavailable for ${mangaId}.`
        );
    }

    override async getChapters(mangaId: string): Promise<Chapter[]> {
        throw new Error(
            `MangaFreak is search-only. Chapters unavailable for ${mangaId}.`
        );
    }

    override async getChapterDetails(
        mangaId: string,
        chapterId: string
    ): Promise<ChapterDetails> {
        throw new Error(
            `MangaFreak is search-only. Chapter details unavailable for ${mangaId}/${chapterId}.`
        );
    }

    override async getSearchResults(
        searchQuery: SearchRequest,
        metadata: any
    ): Promise<PagedResults> {
        const title = searchQuery?.title?.trim();
        if (!title) {
            return createPagedResults({ results: [] });
        }

        const page = metadata?.page ?? 1;
        const request = createRequestObject({
            url: buildSearchUrl(title, page),
            method: "GET",
        });
        const response = await this.requestManager.schedule(request, 1);
        const html = typeof response.data === "string" ? response.data : "";
        const $ = this.cheerio.load(html);
        const tiles: MangaTile[] = [];
        const searchItems = $("div.manga_result .manga_search_item");
        const items = searchItems.length > 0 ? searchItems : $(".manga_search_item");

        items.each((_, element) => {
            const elementScope = $(element);
            const link = elementScope.find("a[href*='/Manga/']").first();
            const rawHref = link.attr("href");
            const id = normalizeMangaId(rawHref);
            const titleText =
                link.text().trim() ||
                elementScope.find("h3 a").first().text().trim() ||
                elementScope.find("img").first().attr("alt")?.trim() ||
                "";
            const rawImage =
                elementScope.find("img").first().attr("data-src") ??
                elementScope.find("img").first().attr("src");
            const image = normalizeUrl(rawImage);

            if (!id || !titleText || !image) {
                return;
            }

            tiles.push(
                createMangaTile({
                    id,
                    title: createIconText({ text: titleText }),
                    image,
                })
            );
        });

        const hasNextPage =
            $("div.pagination a.next_p").length > 0 ||
            $("div.pagination a.last_p").length > 0;
        const nextPage = hasNextPage ? { page: page + 1 } : undefined;

        return createPagedResults({
            results: tiles,
            metadata: nextPage,
        });
    }
}
