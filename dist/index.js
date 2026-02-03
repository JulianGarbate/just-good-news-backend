import express from 'express';
import dotenv from 'dotenv';
import newsRouter from './routes/news.routes.js';
import { startNewsCron } from './cron/news.cron.js';
const url = "https://www.clarin.com/rss/lo-ultimo/";
const sourceName = "Clarín";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());
// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use('/api/news', newsRouter);
startNewsCron("*/30 * * * *", url, sourceName);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map