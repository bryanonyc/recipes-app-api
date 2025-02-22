import { Request, Response } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { logEvents } from './logger';
import { findUser } from '../controllers/auth';

export type UserInfo = {
    username: string,
    name: string,
    isAdmin: boolean,
}

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
            async (err: any, decoded: any) => {
                try {
                    if (err) {
                        if (err instanceof TokenExpiredError) {
                            return res
                                .status(401)
                                .json({
                                    message: `Invalid token.  Token expired at ${err.expiredAt}`
                                });
                        } else {
                            return res
                                .status(500)
                                .json({
                                    message: `Unknown error during token verification.`
                                });
                        }
                    }

                    // one last sanity check
                    const user = await findUser(decoded.username);
                    if (user === null) {
                        res
                            .status(403)
                            .json({
                                message: "No account found.",
                                isError: true,
                            });
                    } else if (!user.isActive) {
                        res
                            .status(403)
                            .json({
                                message: "Your account is inactive.",
                                isError: true,
                            });
                    } else {
                        next();
                    }
                } catch (error: any) {
                    logEvents(`${error.name}: \t
                        ${error.message}\t
                        ${req.method}\t
                        ${req.url}\t
                        ${req.headers.origin}`, 'errors.log'
                    );
                }
            }
        );
    } catch (error: any) {
        logEvents(`${error.name}: \t
            ${error.message}\t
            ${req.method}\t
            ${req.url}\t
            ${req.headers.origin}`, 'errors.log'
        );
        if (error instanceof TokenExpiredError) {
            return { message: error.message };
        }
    }
}

export const getUserInfoFromToken = async (req: Request) => {
    const authHeader = (req.headers.authorization || req.headers.Authorization) as string;
    const token = authHeader.split(' ')[1];

    try {
        const decoded: any = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!!,
        );
        const userInfo: UserInfo = { username: decoded.username, isAdmin: decoded.isAdmin, name: decoded.name };
        return userInfo;
    } catch (error: any) {
        logEvents(`${error.name}: \t
            ${error.message}\t
            ${req.method}\t
            ${req.url}\t
            ${req.headers.origin}`, 'errors.log'
        );
    }
}
