import {
    ContentRating,
    HomeSection,
    Manga,
    MangaTile,
    MangaStatus,
    PagedResults,
    SearchRequest,
    Source,
    SourceInfo,
    TagType,
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
    author: "OpenCode",
    description: "Extension for WeebCentral",
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: BASE_URL,
    sourceTags: [
        {
            text: "Search only",
            type: TagType.YELLOW,
        },
    ],
};

const parseMangaDetails = ($: CheerioAPI, mangaId: string): Manga => {
    const title = extractText($("h1").first().text());
    const image = normalizeUrl($("section img").first().attr("src"));
    
    let description = "";
    let status = MangaStatus.UNKNOWN;
    const authors: string[] = [];
    const artists: string[] = [];
    const genres: string[] = [];

    const rows = $("ul.list-group li");
    rows.each((_, element) => {
        const row = $(element);
        const label = extractText(row.find("span").first().text()).toLowerCase();

        if (label.includes("description")) {
            description = extractText(row.find("div").text());
        } else if (label.includes("status")) {
            const statusText = extractText(row.find("a").text()).toLowerCase();
            if (statusText.includes("ongoing")) status = MangaStatus.ONGOING;
            else if (statusText.includes("completed")) status = MangaStatus.COMPLETED;
        } else if (label.includes("author")) {
            row.find("a").each((_, a) => {
                authors.push(extractText($(a).text()));
            });
        } else if (label.includes("artist")) {
            row.find("a").each((_, a) => {
                artists.push(extractText($(a).text()));
            });
        } else if (label.includes("tags")) {
            row.find("a").each((_, a) => {
                genres.push(extractText($(a).text()));
            });
        }
    });

    const tagSections = genres.length
        ? [
              createTagSection({
                  id: "genres",
                  label: "Genres",
                  tags: genres.map((genre) =>
                      createTag({ id: genre.toLowerCase(), label: genre })
                  ),
              }),
          ]
        : [];

    return createManga({
        id: mangaId,
        titles: [title],
        image: image ?? "",
        status,
        author: authors.join(", ") || undefined,
        artist: artists.join(", ") || undefined,
        desc: description || undefined,
        tags: tagSections,
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
        const html = typeof response.data === "string" ? response.data : "";
        const $ = this.cheerio.load(html);
        return parseMangaDetails($, mangaId);
    }

    override async getChapters(_mangaId: string): Promise<any[]> {
        return [];
    }

    override async getChapterDetails(
        _mangaId: string,
        _chapterId: string
    ): Promise<any> {
        return undefined;
    }

    override async getSearchResults(
        searchQuery: SearchRequest,
        _metadata: any
    ): Promise<PagedResults> {
        const title = searchQuery?.title?.trim();
        if (!title) {
            return createPagedResults({ results: [] });
        }

        const request = createRequestObject({
            url: buildSearchUrl(title),
            method: "GET",
        });
        const response = await this.requestManager.schedule(request, 1);
        const html = typeof response.data === "string" ? response.data : "";
        const $ = this.cheerio.load(html);
        const tiles: MangaTile[] = [];

        $("article").each((_, element) => {
            const article = $(element);
            const link = article.find("a.link").first();
            const rawHref = link.attr("href");
            if (!rawHref) return;

            // Extract ID from /series/ID/slug
            const match = rawHref.match(/\/series\/([^/]+\/[^/]+)/);
            const id = match ? match[1] : rawHref.split("/series/")[1];
            if (!id) return;

            const titleText = extractText(article.find("section a").first().text());
            const image = normalizeUrl(article.find("img").first().attr("src"));

            if (titleText && image) {
                tiles.push(
                    createMangaTile({
                        id,
                        title: createIconText({ text: titleText }),
                        image,
                    })
                );
            }
        });

        return createPagedResults({
            results: tiles,
        });
    }

    override async getHomePageSections(
        sectionCallback: (section: HomeSection) => void
    ): Promise<void> {
        // No homepage sections yet
        const section = createHomeSection({
            id: "empty",
            title: "",
            view_more: false,
            items: [],
        });
        sectionCallback(section);
    }
}
