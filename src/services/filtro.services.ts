type RawNews = {
  title: string;
  subtitle: string;
  originalUrl: string;
  publishedAt: Date | null;
  imageUrl: string | null;
  source: string;
  category: string;
  sentiment: string;
};

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

export function filterNews(news: RawNews[]): RawNews[] {
  console.log(`🔬 Filtrando ${news.length} noticias con palabras clave...`);
  
  const filtered = news.filter(item => {
    const text = `${item.title} ${item.subtitle}`.toLowerCase();

    const hasNegative = NEGATIVE_KEYWORDS.some(word =>
      text.includes(word)
    );

    const hasPositive = POSITIVE_KEYWORDS.some(word =>
      text.includes(word)
    );

    // Determine sentiment based on keywords
    item.sentiment = hasNegative ? 'negative' : 'positive';
    // Default category if not set
    item.category = item.category || 'general';

    // Rechaza solo si tiene palabras negativas, acepta todo lo demás
    const passes = !hasNegative;
    if (!passes) {
      console.log(`  ❌ Descartada (negativa): "${item.title.substring(0, 50)}..."`);
    } else {
      console.log(`  ✅ Aceptada: "${item.title.substring(0, 50)}..." (${item.sentiment})`);
    }
    return passes;
  });

  console.log(`✅ ${filtered.length}/${news.length} noticias aprobadas`);
  return filtered;
}
