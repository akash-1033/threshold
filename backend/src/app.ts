import express from "express";
import type { Express, Request, Response } from "express";

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ status: "OK", message: "Welcome to Threshold Backend" });
})

app.get("/users", (req: Request, res: Response) => {
    res.status(200).json({
        "users": [
            {
                "id": 1,
                "name": "Alice",
                "email": "alice@example.com"
            },
            {
                "id": 2,
                "name": "Bob",
                "email": "bob@example.com"
            }
        ]
    });
})

app.get("/products", (req: Request, res: Response) => {
    res.status(200).json({
        "products": [
            {
                "id": 101,
                "name": "Laptop",
                "price": 79999
            },
            {
                "id": 102,
                "name": "Mouse",
                "price": 999
            }
        ]
    });
})


export default app;