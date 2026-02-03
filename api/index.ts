import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import newsRouter from "../src/routes/news.routes.js";

dotenv.config();

const app = express();

// CORS - Permitir solo desde el frontend
app.use(cors({
  origin: "https://just-good-news.vercel.app",
  credentials: false,
}));

app.use(express.json());

app.use("/api/news", newsRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Handler para Vercel
export default (req: VercelRequest, res: VercelResponse) => {
  app(req as any, res as any);
};
