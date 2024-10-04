import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { handleError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                username: 'asc'
            },
            select: {
                id: true,
                username: true,
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
        isActive,
        isAdmin,
    } = req.body;

    try {
        const result = await prisma.user.update({
            where: {
                id,
            },
            data: {
                isActive,
                isAdmin,
            }
        });
        res.json({ message: 'User was updated successfully' });
    } catch (error) {
        handleError(req, res, error);
    }
};
