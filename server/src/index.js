import express from "express"
import userRouter from "./routes/user-routes"
import authRouter from "./routes/auth";
import marketRouter from "./routes/market-routes";

const app = express()

app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected"))
    .catch((err) => console.error("DB connection err", err));

app.get("/", (req, res) => {
    res.send("hii")
})

app.use("/api/auth", authRouter)
app.use("/api/market", marketRouter)
app.use("/api/user", userRouter)


app.listen(3001, () => {
    console.log("hiii we are good")
})
