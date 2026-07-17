import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import httpProxy from "http-proxy";
import cors from "cors";

const app: Express = express();
const apiProxy = httpProxy.createProxyServer();

app.use(cors());

app.all("/*splat", (req: Request, res: Response, next: NextFunction) => {
    apiProxy.web(req, res, { target: 'http://localhost:3000' }, function (e) {
        if (e) {
            console.error(e);
            next(e);
        }
    });
});

export default app;
