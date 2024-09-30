import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { handleError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

const ONE_HOUR = 60 * 60 * 60;

const ONE_MINUTE = 60;

export const findUser = async (email: string) => {
    const user = await prisma.user.findFirst({
        where: {
            email: {
                equals: email,
                mode: 'insensitive'
            }
        }
    });
    return user;
}

// @desc Login
// @route GET /auth/login
// @access Public
export const handleLoginRequest = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'email and password fields are required',
            isError: true,
        });
    }

    try {
        const user = await findUser(email);
        if (user === null) {
            res
                .status(401)
                .json({
                    message: "No account was found.  Please register or you are not authorized.",
                    isError: true,
                });
        } else if (!user.isActive) {
            res
                .status(403)
                .json({
                    message: "Your account is currently inactive. Please contact an administrator.",
                    isError: true,
                });
        } else {
            // compare the passwords
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res
                    .status(401)
                    .json({
                        message: "Unauthorized",
                        isError: true,
                    });
            }

            const userInfo = {
                "email": user.email,
                "name": user.name,
                "isAdmin": user.isAdmin,
            };

            const accessToken = jwt.sign(
                userInfo,
                process.env.ACCESS_TOKEN_SECRET!!,
                { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
            );

            const refreshToken = jwt.sign(
                userInfo,
                process.env.REFRESH_TOKEN_SECRET!!,
                { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
            );

            // Create secure cookie with refresh token
            res.cookie("jwt", refreshToken, {
                httpOnly: true, // accessible only by web server
                secure: true, // https
                sameSite: "none", // cross-site cookie
                maxAge: 7 * 24 * 60 * 60 * 1000 // cookie expiry: set to match refresh token
            });

            // Send back the access token
            res
                .status(200)
                .json({
                    accessToken
                });
        }
    } catch (error) {
        handleError(req, res, error);
    }
};

// @desc Register
// @route GET /auth/register
// @access Public
export const handleRegisterRequest = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'name, email, and password fields are required'});
    }

    try {
        const user = await findUser(email);
        if (user === null) {
            const hash = bcrypt.hash(password, 10, async (err: any, hash: any) => {
                const user = await prisma.user.create({
                    data: {
                        name,
                        email,
                        password: hash
                    }
                });

                if (user) {
                    res
                        .status(201)
                        .json({
                            message: `New user ${email} created.`,
                            isError: true,
                        });
                } else {
                    res
                        .status(400)
                        .json({
                            message: "Invalid data received.",
                            isError: true,
                        });
                }
            });
        } else {
            res
                .status(409)
                .json({
                    message: "Account already exists.  Please login instead.",
                    isError: true,
                });
        }
    } catch (error) {
        handleError(req, res, error);
    }
};

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
export const handleRefreshTokenRequest = (req: Request, res: Response) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res
            .status(401)
            .json({
                message: 'Unauthorized. No token found.',
                isError: true,
            });
    }

    const refreshToken = cookies.jwt;

    try {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET!!,
            async (err: any, decoded: any) => {
                try {
                    if (err) {
                        return res
                            .status(401)
                            .json({
                                message: 'Your token has expired.  Please try logging in again.',
                                isError: true,
                            });
                    }

                    const user = await findUser(decoded.email);
                    if (user === null) {
                        res
                            .status(403)
                            .json({
                                message: "Forbidden. No account found.",
                                isError: true,
                            });
                    } else {
                        const userInfo = {
                            "email": decoded.email,
                            "name": decoded.name,
                            "isAdmin": decoded.isAdmin,
                        };

                        const accessToken = jwt.sign(
                            userInfo,
                            process.env.ACCESS_TOKEN_SECRET!!,
                            { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
                        );

                        // Send back the access token
                        res
                            .status(200)
                            .json({
                                accessToken
                            });
                        }
                } catch (error) {
                    handleError(req, res, error);
                }
            }
        );
    } catch (error) {
        // console.error('error', error);
        // if (error instanceof TokenExpiredError) {
        //     return { code: 401, message: error.message };
        // }
        handleError(req, res, error);
    }
};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to lcear cookie if exists
export const handleLogoutRequest = (req: Request, res: Response) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.status(200).json({
            message: 'Success, but no JWT cookie found.'
        });
    }

    res.clearCookie(
        'jwt',
        {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        }
    );

    res
        .status(200)
        .json({
            message: 'Cookie cleared'
        });
};
