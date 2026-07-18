import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import httpProxy from "http-proxy";
import cors from "cors";

import { rateLimiter, type RateLimiterRule } from "./middleware/rateLimiter.js";

const app: Express = express();
const apiProxy = httpProxy.createProxyServer();

app.use(cors());

const RATE_LIMIT_RULE: RateLimiterRule = {
    rate_limit: {
        time: 60,
        limit: 3,
    },
};

app.all(/(.*)/, rateLimiter(RATE_LIMIT_RULE), (req: Request, res: Response, next: NextFunction) => {
    apiProxy.web(req, res, { target: 'http://localhost:8000' }, function (e) {
        if (e) {
            console.error(e);
            next(e);
        }
    });
});

export default app;
