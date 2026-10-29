import { Router } from "express";
import { auth } from "../middleware/middleware.js";
import { addBalance } from "../controller/user/add-balance.js";
import { orderPut } from "../controller/user/order-put.js";

const router = Router()

router.post("/add-balance", auth, addBalance);


router.post("/put-order", auth, orderPut);

export default router;
