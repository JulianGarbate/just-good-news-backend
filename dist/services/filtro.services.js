const NEGATIVE_KEYWORDS = [
    "murió",
    "muerte",
    "asesin",
    "crimen",
    "violencia",
    "ataque",
    "tragedia",
    "accidente",
    "choque",
    "herido",
    "guerra",
    "conflicto"
];
const POSITIVE_KEYWORDS = [
    "avance",
    "descubren",
    "innovación",
    "tecnología",
    "ciencia",
    "investigación",
    "mejora",
    "nuevo",
    "logro",
    "histórico",
    "cultural"
];
export function filterNews(news) {
    return news.filter(item => {
        const text = `${item.title} ${item.subtitle}`.toLowerCase();
        const hasNegative = NEGATIVE_KEYWORDS.some(word => text.includes(word));
        const hasPositive = POSITIVE_KEYWORDS.some(word => text.includes(word));
        // Determine sentiment based on keywords
        item.sentiment = hasNegative ? 'negative' : 'positive';
        // Default category if not set
        item.category = item.category || 'general';
        return !hasNegative && hasPositive;
    });
}
//# sourceMappingURL=filtro.services.js.map