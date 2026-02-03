import { Router } from "express";
import { obtenerNoticias, buscarNoticia, categorias } from "../controllers/news.controllers.js";

const newsRouter = Router();

newsRouter.get("/articles", obtenerNoticias);
newsRouter.get("/categoria/:categoria", categorias);
newsRouter.get("/:id", buscarNoticia);
newsRouter.get("/", obtenerNoticias);

export default newsRouter;