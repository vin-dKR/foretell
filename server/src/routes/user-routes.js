import { Router } from "express";
import { auth } from "../middleware/middleware";
import { addBalance } from "../controller/user/add-balance";
import { orderPut } from "../controller/user/order-put";

const router = Router()

router.post("/add-balance", auth, addBalance)


router.post("/put-order", auth, orderPut)

export default userRouter
