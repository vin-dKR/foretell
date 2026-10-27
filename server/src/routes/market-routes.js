import { Router } from "express";
import router from "./auth";
import { createMarket } from "../controller/market/create-market";
import { resolveMarket } from "../controller/market/market-resolution";

const router = Router()

router.post("/create", auth, createMarket)

router.post("/:marketId/resolve", auth, resolveMarket)

export default marketRouter
