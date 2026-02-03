import Parser from "rss-parser";
const parser = new Parser();
export const fetchNews = async (url, sourceName) => {
    const feed = await parser.parseURL(url);
    const news = feed.items.map(item => ({
        title: item.title,
        subtitle: item.contentSnippet || item.content || "",
        originalUrl: item.link,
        publishedAt: item.pubDate ? new Date(item.pubDate) : null,
        imageUrl: extractImage(item),
        source: sourceName
    }));
    return news;
};
function extractImage(item) {
    if (item.enclosure && item.enclosure.url) {
        return item.enclosure.url;
    }
    return null;
}
//# sourceMappingURL=fetch.services.js.map