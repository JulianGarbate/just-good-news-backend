import { fetchNews } from "./fetch.services.js";
import { filterNews } from "./filtro.services.js";
import prisma from "../prisma.js";

type news = {
  title: string;
  subtitle: string;
  originalUrl: string;
  publishedAt: Date | null;
  imageUrl: string | null;
  source: string;
  category: string;
  sentiment: string;
};

export async function nuevasNoticias(url: string, sourceName: string) {
    console.log(`\n🔍 Iniciando búsqueda de noticias para ${sourceName}...`);
    const noticias = await fetchNews(url, sourceName);
    console.log(`📰 Filtrando ${noticias.length} noticias...`);
    const noticiasFiltradas = filterNews(noticias as news[]);
    console.log(`✨ ${noticiasFiltradas.length} noticias pasaron el filtro`);
    
    if (noticiasFiltradas.length > 0) {
      try {
        // Verificar cuáles ya existen
        const urlsExistentes = await prisma.news.findMany({
          where: {
            originalUrl: {
              in: noticiasFiltradas.map(n => n.originalUrl)
            }
          },
          select: { originalUrl: true }
        });
        
        const urlsExistentesSet = new Set(urlsExistentes.map(n => n.originalUrl));
        const noticiasNuevas = noticiasFiltradas.filter(n => !urlsExistentesSet.has(n.originalUrl));
        
        console.log(`📊 ${noticiasNuevas.length} noticias nuevas (${urlsExistentes.length} ya existen)`);
        
        if (noticiasNuevas.length > 0) {
          // Asegurar que todas tengan publishedAt válido
          const noticiaValidas = noticiasNuevas.map(noticia => ({
            ...noticia,
            publishedAt: noticia.publishedAt || new Date()
          }));
          
          console.log(`📝 Preparando ${noticiaValidas.length} noticias para guardar...`);
          
          const created = await prisma.news.createMany({
            data: noticiaValidas
          });
          console.log(`💾 ${created.count} noticias guardadas en BD`);
        } else {
          console.log(`⏭️ Todas las noticias ya existen en BD`);
        }
      } catch (error) {
        console.error(`❌ Error guardando en BD:`, error);
      }
    } else {
      console.log(`⚠️ No hay noticias para guardar (filtradas: ${noticias.length})`);
    }
    
    return noticiasFiltradas;
}