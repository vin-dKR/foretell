import { Router } from "express";
import { signin, signup } from "../controller/auth";

const router = Router()

router.post("/signup", signin)
router.post("/signin", signup)

export default authRouter
