import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import dotenv from "dotenv";
import newsRouter from "../src/routes/news.routes.js";

dotenv.config();

const app = express();

// CORS - Solo permitir desde el frontend en producción
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ["https://just-good-news.vercel.app"]
  : ["https://just-good-news.vercel.app", "http://localhost:3000"];

app.use(express.json());

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  } else if (origin) {
    // Origen no permitido
    return res.status(403).json({ error: "CORS policy: Origin not allowed" });
  }
  
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  
  next();
});

app.use("/api/news", newsRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Handler para Vercel
export default (req: VercelRequest, res: VercelResponse) => {
  app(req as any, res as any);
};
