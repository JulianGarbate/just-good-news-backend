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
export declare function filterNews(news: RawNews[]): RawNews[];
export {};
//# sourceMappingURL=filtro.services.d.ts.map