export declare const fetchNews: (url: string, sourceName: string) => Promise<{
    title: string | undefined;
    subtitle: string;
    originalUrl: string | undefined;
    publishedAt: Date | null;
    imageUrl: string | null;
    source: string;
}[]>;
//# sourceMappingURL=fetch.services.d.ts.map