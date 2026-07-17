import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.status(200).json({ status: "OK", message: "Welcome to Threshold Backend" });
})

export default app;