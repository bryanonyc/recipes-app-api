import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { handleError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                email: 'asc'
            },
            select: {
                id: true,
                email: true,
                name: true,
                isAdmin: true,
                isActive: true,
            }
        });
        res.json(users);
    } catch (error) {
        handleError(req, res, error);
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const {
        id,
        email,
        name,
        isActive,
        isAdmin,
    } = req.body;

    try {
        const result = await prisma.user.update({
            where: {
                id,
            },
            data: {
                email,
                name,
                isActive,
                isAdmin,
            }
        });
        res.json(result);
    } catch (error) {
        handleError(req, res, error);
    }
};
