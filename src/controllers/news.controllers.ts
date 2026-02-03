import type { Request, Response } from "express";
import prisma from "../prisma.js";
import { nuevasNoticias } from "../services/news.services.js";

export const obtenerNoticias = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const skip = (page - 1) * limit;

    console.log(`🔎 GET /news - página ${page}, límite ${limit}`);

    try {
        const total = await prisma.news.count();
        console.log(`📊 Total de noticias en BD: ${total}`);
        
        const noticias = await prisma.news.findMany({
            skip,
            take: limit,
            orderBy: { publishedAt: 'desc' }
        });
        
        console.log(`✅ Enviando ${noticias.length} noticias`);
        
        const hasMore = skip + limit < total;
        
        res.json({
            articles: noticias,
            hasMore,
            total,
            page,
            limit
        });
    } catch (error) {
        console.error(`❌ Error en obtenerNoticias:`, error);
        res.status(500).json({ message: "Error al obtener noticias" });
    }
};

export const buscarNoticia = async (req: Request, res: Response) => {
    const { id } = req.params;
    const noticia = await prisma.news.findUnique({
        where: { id: Number(id) },
    });
    if (noticia) {
        res.json(noticia);
    } else {
        res.status(404).json({ message: "Noticia no encontrada" });
    }
};

export const categorias = async (req: Request, res: Response) => {
    const { categoria } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const skip = (page - 1) * limit;
    
    const categoriaValue = Array.isArray(categoria) ? categoria[0] : categoria;
    const total = await prisma.news.count({
        where: { category: categoriaValue as string }
    });
    const categoriaNews = await prisma.news.findMany({
        where: { category: categoriaValue as string },
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' }
    });
    const hasMore = skip + limit < total;
    
    res.json({
        articles: categoriaNews,
        hasMore,
        total,
        page,
        limit
    });
};

export const crearNoticia = async (req: Request, res: Response) => {
    const { url, sourceName } = req.body;
    try {
        const noticias = await nuevasNoticias(url, sourceName);
        const noticiasCreadas = [];
        for (const noticia of noticias) {
            const existingNews = await prisma.news.findFirst({
                where: { originalUrl: noticia.originalUrl },
            });
            if (existingNews) {
                continue;
            }
            const noticiaCreada = await prisma.news.create({
                data: {
                    ...noticia,
                    publishedAt: noticia.publishedAt || new Date(),
                    category: noticia.category,
                    sentiment: noticia.sentiment,
                },
            });
            noticiasCreadas.push(noticiaCreada);
        }
        res.json(noticiasCreadas);
    } catch (error) {
        res.status(500).json({ message: "Error al crear noticias" });
    }
};
