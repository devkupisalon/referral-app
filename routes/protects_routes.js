import expressIP from 'express-ip';
import rateLimit from 'express-rate-limit';

import { app } from './init.js';
import logger from "./logs/logger.js";

import {
    block_IP,
    get_requests,
    save_request
} from "./database/utils.js";

const module = import.meta.filename;
const rate_limit = 10;

app.use(expressIP().getIpInfoMiddleware);

const allowed_IPs = ['192.168.0.1', '10.0.0.1'];

const BLOCK_IP = async (req, res, next) => {
    const { method, body, sessionID } = req;
    const ip = req.ipInfo.clientIp;
    await save_request(ip, method, body, sessionID);
    const ip_requests_count = await get_requests(ip);
    if (ip_requests_count > rate_limit) {
        logger.warn(`Blocking IP ${ip}...`, { module });
        await block_IP(ip);
        res.status(429).send('There are to many requests., IP blocked.');
    } else {
        next();
    }
};

const LIMITER = rateLimit({
    windowMs: 60 * 1000,
    max: rate_limit,
    message: 'Too many requests from your IP, you are blocked.',
    skip: (req) => {
        return allowed_IPs.includes(req.ip);
    }
});

app.use(BLOCK_IP);
app.use(LIMITER);