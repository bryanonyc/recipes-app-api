import { Request, Response } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';

export const verifyJWT = (req: Request, res: Response, next: Function) => {
    const authHeader = (req.headers.authorization || req.headers.Authorization) as string;

    if (!authHeader?.startsWith('Bearer ')) {
        return res
            .status(401)
            .json({
                message: 'Unauhorized. No token was provided with the request.'
            });
    }

    const token = authHeader.split(' ')[1];
    try {
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!!,
            (err: any, decoded: any) => {
                try {
                    if (err) {
                        return res
                            .status(403)
                            .json({
                                message: 'Forbidden'
                            });
                    }

                    next();
                } catch (error) {
                    console.log(error)
                }
            }
        );
    } catch (error) {
        console.error('verifyJWT() error', error);
        if (error instanceof TokenExpiredError) {
            return { message: error.message };
        }
    }
}
