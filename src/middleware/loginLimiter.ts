import rateLimit from 'express-rate-limit';
import { logEvents } from "./logger";
import { Request, Response } from 'express';

export const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 login requests per `window` per minute
    message: { message: 'Too many login attempts from this IP.  Please try again after a 1 minute pause' },
    handler: (req: Request, res: Response, next: Function, options: any) => {
        logEvents(`Too Many Requests: ${options.message.message}\t
            ${req.method}\t
            ${req.url}\t
            ${req.headers.origin}`,
            'errors.log'
        );

        res
            .status(options.statusCode)
            .send(options.message);
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false // Disable the `X-RateLimit-*` headers
});
