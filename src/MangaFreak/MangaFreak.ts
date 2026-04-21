import type { CheerioAPI } from "cheerio";
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
import { parseLangCode } from "./Languages";
import {
    buildMangaUrl,
    buildSearchUrl,
    extractChapterId,
    extractNumber,
    extractText,
    normalizeMangaId,
    normalizeUrl,
    parseMangaStatusEnum,
    WEBSITE_BASE_URL,
} from "./Common";


export const MangaFreakInfo: SourceInfo = {
    version: "1.0.15",
    name: "MangaFreak",
    icon: "icon.png",
    author: "OpenCode",
    description: "MangaFreak extension",
    contentRating: ContentRating.MATURE,
    websiteBaseURL: WEBSITE_BASE_URL,
    sourceTags: [],
};

const parseMangaDetails = ($: CheerioAPI, mangaId: string): Manga => {
    const container = $(".manga_series_info_section").first();
    const titleText = extractText(container.find("h1").first().text());
    if (!titleText) {
        throw new Error(`MangaFreak details missing title for ${mangaId}.`);
    }

    const rawImage = container
        .find(".manga_series_image img")
        .first()
        .attr("src");
    const image = normalizeUrl(rawImage);

    const infoRows = container.find(".manga_series_data > div");
    let author = "";
    let artist = "";
    let statusText: string | undefined;

    infoRows.each((_, element) => {
        const rowText = extractText($(element).text());
        const lower = rowText.toLowerCase();
        if (lower.startsWith("written by:")) {
            author = extractText(rowText.replace(/written by:/i, ""));
        } else if (lower.startsWith("illustrated by:")) {
            artist = extractText(rowText.replace(/illustrated by:/i, ""));
        } else if (lower.includes("series")) {
            statusText = rowText;
        }
    });

    const genres = container
        .find(".series_sub_genre_list a")
        .map((_, element) => extractText($(element).text()))
        .get()
        .filter((value) => value.length > 0);

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

    const description = extractText(
        $(".manga_series_description p").first().text()
    );

    const statusParsed = parseMangaStatusEnum(statusText);

    return createManga({
        id: mangaId,
        titles: [titleText],
        image: image ?? normalizeUrl(container.find("img").first().attr("src")) ?? "",
        status:
            statusParsed === "ONGOING"
                ? MangaStatus.ONGOING
                : statusParsed === "COMPLETED"
                  ? MangaStatus.COMPLETED
                  : MangaStatus.UNKNOWN,
        author: author || undefined,
        artist: artist || undefined,
        desc: description || undefined,
        tags: tagSections,
    });
};

const parseChapterList = ($: CheerioAPI, mangaId: string): Chapter[] => {
    const chapters: Chapter[] = [];
    const rows = $(".manga_series_list table tbody tr");

    rows.each((_, element) => {
        const row = $(element);
        const link = row.find("a[href]").first();
        const rawHref = link.attr("href");
        const id = extractChapterId(rawHref);
        const name = extractText(link.text());
        const dateText = extractText(row.find("td").last().text());

        if (!id) {
            return;
        }

        const time = dateText ? new Date(dateText) : undefined;
        chapters.push(
            createChapter({
                id,
                mangaId,
                name: name || undefined,
                chapNum: extractNumber(name) ?? 0,
                time: time && !Number.isNaN(time.getTime()) ? time : undefined,
                langCode: parseLangCode(""),
            })
        );
    });

    if (chapters.length > 0) {
        return chapters;
    }

    const fallback = $(".series_sub_chapter_list a[href]");
    fallback.each((_, element) => {
        const link = $(element);
        const rawHref = link.attr("href");
        const id = extractChapterId(rawHref);
        const name = extractText(link.text());

        if (!id) {
            return;
        }

        chapters.push(
            createChapter({
                id,
                mangaId,
                name: name || undefined,
                chapNum: extractNumber(name) ?? 0,
                langCode: parseLangCode(""),
            })
        );
    });

    return chapters;
};

export class MangaFreak extends Source {
    override requestManager = createRequestManager({
        requestsPerSecond: 2,
        requestTimeout: 10000,
    });

    override async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: buildMangaUrl(mangaId),
            method: "GET",
        });
        try {
            const response = await this.requestManager.schedule(request, 1);
            const html = typeof response.data === "string" ? response.data : "";
            const $ = this.cheerio.load(html);
            return parseMangaDetails($, mangaId);
        } catch (e) {
            console.error(`MangaFreak getMangaDetails failed: ${e}`);
            throw e;
        }
    }

    override async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: buildMangaUrl(mangaId),
            method: "GET",
        });
        try {
            const response = await this.requestManager.schedule(request, 1);
            const html = typeof response.data === "string" ? response.data : "";
            const $ = this.cheerio.load(html);
            return parseChapterList($, mangaId);
        } catch (e) {
            console.error(`MangaFreak getChapters failed: ${e}`);
            return [];
        }
    }

    override async getChapterDetails(
        mangaId: string,
        chapterId: string
    ): Promise<ChapterDetails> {
        try {
            const request = createRequestObject({
                url: new URL(chapterId, WEBSITE_BASE_URL).toString(),
                method: "GET",
            });
            const response = await this.requestManager.schedule(request, 1);
            const html = typeof response.data === "string" ? response.data : "";
            const $ = this.cheerio.load(html);

            const pages: string[] = [];
            const selectors = [
                ".manga_read_card img",
                ".read-container img",
                ".read_img img",
                ".read_image img",
                ".mySlides img",
                ".image_orientation img",
                "#reader_area img",
                "img.my-img",
                "img#gohere",
            ];

            for (const selector of selectors) {
                $(selector).each((_, element) => {
                    const img = $(element);
                    const src = img.attr("data-src") ?? img.attr("src");
                    const normalized = normalizeUrl(src);
                    if (normalized && !pages.includes(normalized)) {
                        pages.push(normalized);
                    }
                });
                if (pages.length > 0) break;
            }

            // Fallback: search for gImages in scripts
            if (pages.length === 0) {
                $("script").each((_, element) => {
                    const text = $(element).text();
                    const match = text.match(/var gImages = \[(.*?)\];/);
                    if (match?.[1]) {
                        const urls = match[1]
                            .split(",")
                            .map((s) => s.trim().replace(/^['"]|['"]$/g, ""));
                        for (const url of urls) {
                            const normalized = normalizeUrl(url);
                            if (normalized && !pages.includes(normalized)) {
                                pages.push(normalized);
                            }
                        }
                    }
                });
            }

            // Fallback: collect direct image URLs from chapter HTML
            if (pages.length === 0) {
                const matches = html.match(/https?:\/\/[^"'\s>]+\.(?:jpg|jpeg|png|webp)/gi) ?? [];
                for (const url of matches) {
                    const normalized = normalizeUrl(url);
                    if (
                        normalized &&
                        normalized.includes("/mangas/") &&
                        !normalized.includes("/manga_images/") &&
                        !pages.includes(normalized)
                    ) {
                        pages.push(normalized);
                    }
                }
            }

            return createChapterDetails({
                id: chapterId,
                mangaId,
                pages,
                longStrip: false,
            });
        } catch (e) {
            console.error(`MangaFreak getChapterDetails failed: ${e}`);
            throw e;
        }
    }

    override async getSearchResults(
        searchQuery: SearchRequest,
        metadata: any
    ): Promise<PagedResults> {
        try {
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
                const primaryLink = elementScope
                    .find("a[href*='/Manga/']")
                    .first();
                const link = primaryLink.length
                    ? primaryLink
                    : elementScope.find("a[href]").first();
                const rawHref = link.attr("href");
                const id = normalizeMangaId(rawHref);
                const titleText =
                    extractText(link.text()) ||
                    extractText(elementScope.find("h3 a").first().text()) ||
                    extractText(elementScope.find("img").first().attr("alt")) ||
                    extractText(link.attr("title")) ||
                    "";
                const imageElement = elementScope.find("img").first();
                const rawImage =
                    imageElement.attr("data-src") ?? imageElement.attr("src");
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

            if (tiles.length === 0) {
                const fallbackLinks =
                    $(".manga_search_item a[href*='/Manga/']").length > 0
                        ? $(".manga_search_item a[href*='/Manga/']")
                        : $("div.manga_result a[href*='/Manga/']").length > 0
                          ? $("div.manga_result a[href*='/Manga/']")
                          : $("a[href*='/Manga/']");
                fallbackLinks.each((_, element) => {
                    const link = $(element);
                    const rawHref = link.attr("href");
                    const id = normalizeMangaId(rawHref);
                    const parentItem = link.closest(".manga_search_item");
                    const titleText =
                        extractText(link.text()) ||
                        extractText(parentItem.find("h3 a").first().text()) ||
                        extractText(parentItem.find("img").first().attr("alt")) ||
                        extractText(link.attr("title")) ||
                        extractText(link.find("img").first().attr("alt")) ||
                        "";
                    const imageElement = parentItem.find("img").first();
                    const fallbackImage = imageElement.length
                        ? imageElement
                        : link.find("img").first();
                    const rawImage =
                        fallbackImage.attr("data-src") ?? fallbackImage.attr("src");
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
            }

            const hasNextPage =
                $("div.pagination a.next_p").length > 0 ||
                $("div.pagination a.last_p").length > 0;
            const nextPage = hasNextPage ? { page: page + 1 } : undefined;

            return createPagedResults({
                results: tiles,
                metadata: nextPage,
            });
        } catch (e) {
            console.error(`MangaFreak getSearchResults failed: ${e}`);
            return createPagedResults({ results: [] });
        }
    }

    override async getHomePageSections(
        sectionCallback: (section: HomeSection) => void
    ): Promise<void> {
        sectionCallback(
            createHomeSection({
                id: "empty",
                title: "",
                view_more: false,
                items: [],
            })
        );
    }
}
