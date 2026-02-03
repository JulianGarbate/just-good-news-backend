import { fetchNews } from "./fetch.services.js";
import { filterNews } from "./filtro.services.js";
export async function nuevasNoticias(url, sourceName) {
    const noticias = await fetchNews(url, sourceName);
    const noticiasFiltradas = filterNews(noticias);
    return noticiasFiltradas;
}
//# sourceMappingURL=news.services.js.map