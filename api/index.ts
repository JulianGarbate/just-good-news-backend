import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import newsRouter from "../src/routes/news.routes.js";

dotenv.config();

const app = express();

// CORS - Permisivo
app.use(cors());

app.use(express.json());

// Rutas
app.use("/news", newsRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Root
app.get("/", (req, res) => {
  res.json({ message: "Just Good News API v1" });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("❌ Error:", err);
  res.status(500).json({ error: err.message });
});

// Handler para Vercel
export default (req: VercelRequest, res: VercelResponse) => {
  app(req as any, res as any);
};
