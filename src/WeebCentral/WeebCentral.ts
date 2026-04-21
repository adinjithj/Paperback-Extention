import {
    Chapter,
    ChapterDetails,
    ContentRating,
    HomeSection,
    Manga,
    MangaTile,
    MangaStatus,
    PagedResults,
    SearchRequest,
    Source,
    SourceInfo,
} from "paperback-extensions-common";
import {
    buildMangaUrl,
    buildSearchUrl,
    extractText,
    normalizeUrl,
    BASE_URL,
} from "./Common";
import type { CheerioAPI } from "cheerio";

export const WeebCentralInfo: SourceInfo = {
    version: "1.0.0",
    name: "WeebCentral",
    icon: "icon.png",
    author: "Paperback Team",
    description: "Extension for WeebCentral",
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: BASE_URL,
    sourceTags: [],
};

const parseSeriesId = (value?: string): string | undefined => {
    if (!value) {
        return undefined;
    }

    // Extract ID and Slug from /series/ID/SLUG
    const match = value.match(/\/series\/([^/?#]+)\/([^/?#]+)/);
    if (match) {
        return `${match[1]}/${match[2]}`;
    }

    const simpleMatch = value.match(/\/series\/([^/?#]+)/);
    return simpleMatch ? simpleMatch[1] : undefined;
};

const parseStatus = (value: string): MangaStatus => {
    const normalized = value.toLowerCase();
    if (normalized.includes("ongoing")) {
        return MangaStatus.ONGOING;
    }

    if (normalized.includes("complete")) {
        return MangaStatus.COMPLETED;
    }

    if (normalized.includes("hiatus")) {
        return MangaStatus.HIATUS;
    }

    if (normalized.includes("cancel")) {
        return MangaStatus.ABANDONED;
    }

    return MangaStatus.UNKNOWN;
};

const parseMangaDetails = ($: CheerioAPI, mangaId: string): Manga => {
    const title = extractText($("h1").first().text());
    const image = normalizeUrl($("picture img").first().attr("src") ?? $("meta[property='og:image']").attr("content"));

    let description = "";
    let status = MangaStatus.UNKNOWN;
    const authors: string[] = [];
    const artists: string[] = [];
    const genres: string[] = [];

    // The site uses a list of items for metadata
    $("ul li, div.flex.flex-col").each((_, element) => {
        const text = $(element).text();
        const label = extractText($(element).find("strong, span").first().text()).toLowerCase();
        
        if (label.includes("description")) {
            description = extractText($(element).find("p").text());
        } else if (label.includes("status")) {
            status = parseStatus(extractText(text.replace(/status/i, "")));
        } else if (label.includes("author")) {
            $(element).find("a").each((_, a) => {
                authors.push(extractText($(a).text()));
            });
        } else if (label.includes("artist")) {
            $(element).find("a").each((_, a) => {
                artists.push(extractText($(a).text()));
            });
        } else if (label.includes("tags") || label.includes("genres")) {
            $(element).find("a").each((_, a) => {
                genres.push(extractText($(a).text()));
            });
        }
    });

    if (!description) {
        description = extractText($("meta[name='description']").attr("content"));
    }

    return createManga({
        id: mangaId,
        titles: [title || mangaId],
        image: image ?? "",
        status,
        author: authors.join(", ") || undefined,
        artist: artists.join(", ") || undefined,
        desc: description || undefined,
        tags: genres.length ? [
            createTagSection({
                id: "genres",
                label: "Genres",
                tags: genres.map(g => createTag({ id: g.toLowerCase().replace(/\s+/g, "-"), label: g }))
            })
        ] : [],
    });
};

export class WeebCentral extends Source {
    override requestManager = createRequestManager({
        requestsPerSecond: 2,
        requestTimeout: 20000,
    });

    override async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: buildMangaUrl(mangaId),
            method: "GET",
        });
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(typeof response.data === "string" ? response.data : "");
        return parseMangaDetails($, mangaId);
    }

    override async getChapters(_mangaId: string): Promise<Chapter[]> {
        return []; // Phase 1: Not implemented
    }

    override async getChapterDetails(_mangaId: string, _chapterId: string): Promise<ChapterDetails> {
        return createChapterDetails({
            id: _chapterId,
            mangaId: _mangaId,
            pages: [],
            longStrip: false
        });
    }

    override async getSearchResults(searchQuery: SearchRequest, _metadata: any): Promise<PagedResults> {
        const title = searchQuery?.title?.trim();
        if (!title) {
            return createPagedResults({ results: [] });
        }

        const request = createRequestObject({
            url: buildSearchUrl(title),
            method: "GET",
        });

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(typeof response.data === "string" ? response.data : "");
        const tiles: MangaTile[] = [];

        $("article.bg-base-300.flex.gap-4.p-4").each((_, element) => {
            const article = $(element);
            const link = article.find("a[href*='/series/']").first();
            const rawHref = link.attr("href");
            const id = parseSeriesId(rawHref);

            if (id) {
                const titleText = extractText(article.find("a.link.link-hover.font-bold").text());
                const image = normalizeUrl(article.find("picture img").attr("src"));

                if (titleText && image) {
                    tiles.push(createMangaTile({
                        id,
                        title: createIconText({ text: titleText }),
                        image
                    }));
                }
            }
        });

        return createPagedResults({ results: tiles });
    }

    override async getHomePageSections(_sectionCallback: (section: HomeSection) => void): Promise<void> {
        // Phase 1: Not implemented
    }
}
