import express from 'express';
import dotenv from 'dotenv';
import newsRouter from './routes/news.routes.js';
import { startNewsCron } from './cron/news.cron.js';
const contenido = [
    { "source": "Clarín Tecnología", "url": "https://www.clarin.com/rss/tecnologia/" },
    { "source": "Clarín Lo Último", "url": "https://www.clarin.com/rss/lo-ultimo/" },
    { "source": "Agencia SINC", "url": "http://www.agenciasinc.es/feed/noticias" },
    { "source": "Science Daily - Science", "url": "https://www.sciencedaily.com/rss/top/science.xml" },
    { "source": "Science Daily - Technology", "url": "https://www.sciencedaily.com/rss/top/technology.xml" },
    { "source": "BBC Mundo Ciencia", "url": "https://feeds.bbci.co.uk/mundo/topics/ciencia/rss.xml" },
    { "source": "BBC Mundo Tecnología", "url": "https://feeds.bbci.co.uk/mundo/topics/tecnologia/rss.xml" },
    { "source": "El País Ciencia", "url": "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/ciencia/portada" },
    { "source": "El País Tecnología", "url": "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/tecnologia/portada" },
    { "source": "Xataka Ciencia", "url": "https://www.xataka.com/tag/ciencia/rss2.xml" },
    { "source": "Xataka Tecnología", "url": "https://www.xataka.com/index.xml" },
    { "source": "Muy Interesante Ciencia", "url": "https://www.muyinteresante.es/feed/" },
    { "source": "National Geographic España", "url": "https://www.nationalgeographic.es/rss" },
    { "source": "Europa Press Ciencia", "url": "https://www.europapress.es/rss/rss.aspx?ch=79" }
];
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use('/api/news', newsRouter);
// Solo ejecutar cron en desarrollo o si está explícitamente habilitado
if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_CRON === 'true') {
    const url = contenido[getRandomInt(contenido.length)]?.url;
    const source = contenido[getRandomInt(contenido.length)]?.source;
    console.log(`📰 Fuente seleccionada para cron: ${source} - ${url}`);
    startNewsCron("*/30 * * * *", url, source);
}
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map