import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/response.js';

const keyGenerator = (req) => {
    return req.user?.id || req['ip'];
};

// Strict rate limiter for expensive AI generation endpoints
export const generateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // limit each user/IP to 10 generation requests per 15 minutes
    keyGenerator: keyGenerator,
    handler: (req, res, next, options) => {
        const resetTime = req.rateLimit.resetTime;
        let timeString = 'a few minutes';
        if (resetTime) {
            const remainingMs = resetTime.getTime() - Date.now();
            const mins = Math.floor(remainingMs / 60000);
            const secs = Math.ceil((remainingMs % 60000) / 1000);
            timeString = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
        }
        return sendError(res, `Too many requests. Please try again in ${timeString}.`,null, 429);
    },
    standardHeaders: true, 
    legacyHeaders: false,
    validate: false
});

// General rate limiter for standard API endpoints
export const apiLimiter = rateLimit({
    windowMs: 3 * 60 * 1000, 
    max: 300,
    keyGenerator: keyGenerator,
    handler: (req, res, next, options) => {
        const resetTime = req.rateLimit.resetTime;
        let timeString = 'a while';
        if (resetTime) {
            const remainingMs = resetTime.getTime() - Date.now();
            const mins = Math.floor(remainingMs / 60000);
            const secs = Math.ceil((remainingMs % 60000) / 1000);
            timeString = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
        }
        return sendError(res, `Too many requests. Please try again in ${timeString}.`,null, 429);
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: false
});
