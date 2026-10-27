import express from "express"

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
    res.send("hii")
})

app.listen(3001, () => {
    console.log("hiii we are good")
})
