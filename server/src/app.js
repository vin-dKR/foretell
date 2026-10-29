import express from "express";
import authRouter from "./routes/auth.js";
import marketRouter from "./routes/market-routes.js";
import userRouter from "./routes/user-routes.js";

export function createApp() {
    const app = express();

    app.use(express.json());

    app.get("/", (req, res) => {
        res.json({ message: "Prediction API" });
    });

    app.use("/api/auth", authRouter);
    app.use("/api/market", marketRouter);
    app.use("/api/user", userRouter);

    app.use((req, res) => {
        res.status(404).json({ error: "Route not found" });
    });

    return app;
}
