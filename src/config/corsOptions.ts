import { ALLOWED_ORIGINS, ALLOWED_ORIGINS_DEV } from './allowedOrigins';

const allowedOrigins =
    process.env.NODE_ENV === 'development'
        ? ALLOWED_ORIGINS_DEV
        : ALLOWED_ORIGINS;

export const corsOptions = {
    origin: (origin: any, callback: Function) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};
