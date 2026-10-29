import mongoose from "mongoose";
import { createApp } from "./app.js";

const port = Number(process.env.PORT) || 3001;

async function start() {
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI must be configured before starting the API");
        process.exitCode = 1;
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        createApp().listen(port, () => {
            console.log(`Prediction API listening on port ${port}`);
        });
    } catch (error) {
        console.error("Unable to connect to MongoDB", error);
        process.exitCode = 1;
    }
}

start();
