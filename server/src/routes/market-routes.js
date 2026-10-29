import { Router } from "express";
import { createMarket } from "../controller/market/create-market.js";
import { resolveMarket } from "../controller/market/market-resolution.js";
import { auth } from "../middleware/middleware.js";

const router = Router()

router.post("/create", auth, createMarket);

router.post("/:marketId/resolve", auth, resolveMarket);

export default router;
