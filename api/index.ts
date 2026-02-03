import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import newsRouter from "../src/routes/news.routes.js";

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: "https://just-good-news.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
  credentials: false,
};

// En desarrollo, permitir localhost
if (process.env.NODE_ENV !== 'production') {
  corsOptions.origin = ["https://just-good-news.vercel.app", "http://localhost:3000"];
}

app.use(cors(corsOptions));
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
