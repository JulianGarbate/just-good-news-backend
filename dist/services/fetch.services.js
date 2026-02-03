import Parser from "rss-parser";
const parser = new Parser();
export const fetchNews = async (url, sourceName) => {
    console.log(`📡 Fetcheando noticias de ${sourceName}: ${url}`);
    try {
        const feed = await parser.parseURL(url);
        console.log(`✅ ${feed.items.length} items obtenidos del feed de ${sourceName}`);
        const news = feed.items.map(item => ({
            title: item.title,
            subtitle: item.contentSnippet || item.content || "",
            originalUrl: item.link,
            publishedAt: item.pubDate ? new Date(item.pubDate) : null,
            imageUrl: extractImage(item),
            source: sourceName
        }));
        console.log(`📦 Noticias parseadas: ${news.length}`);
        return news;
    }
    catch (error) {
        console.error(`❌ Error fetcheando noticias de ${sourceName}:`, error);
        return [];
    }
};
function extractImage(item) {
    if (item.enclosure && item.enclosure.url) {
        return item.enclosure.url;
    }
    return null;
}
//# sourceMappingURL=fetch.services.js.map