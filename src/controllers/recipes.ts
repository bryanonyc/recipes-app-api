import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { handleError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getRecipes = async (req: Request, res: Response) => {
    try {
        const recipes = await prisma.recipe.findMany({
            orderBy: {
                id: 'desc'
            },
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                },
                rating: {
                    select: {
                        rating: true
                    }
                },
                tags: {
                    select: {
                        name: true
                    }
                }
            }
        });
        res.json(recipes);
    } catch (error) {
        handleError(req, res, error);
    }
}

export const createRecipe = async (req: Request, res: Response) => {
    const {
        title,
        description,
        ingredients,
        directions,
        prepTime,
        cookTime,
        totalTime,
        servings,
        author,
        tags
    } = req.body;

    const { email } = author;

    try {
        let user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (user === null) {
            res
                .status(401)
                .json({
                    message: "No account found. Only registered users can submit recipes."
                });
        }

        const result = await prisma.recipe.create({
            data: {
                title,
                description,
                ingredients,
                directions,
                prepTime,
                cookTime,
                totalTime,
                servings,
                author: {
                    connect: {
                        email
                    }
                },
                tags: {
                    create: tags
                }
            }
        });
        res.json(result);
    } catch (error) {
        handleError(req, res, error);
    }
}

export const deleteRecipe = async (req: Request, res: Response) => {
    const recipeId = parseInt(req.params.id);
    try {
        const result = await prisma.recipe.delete({
            where: { id: recipeId }
        });
        res.json(result);
    } catch (error) {
        handleError(req, res, error);
    }
};

export const rateRecipe = async (req: Request, res: Response) => {
    const recipeId = parseInt(req.params.id);
    const { rating } = req.body;

    try {
        const result = await prisma.recipeRating.create({
            data: { recipeId, rating}
        });
        res.json(result);
    } catch (error) {
        handleError(req, res, error);
    }
}

export const getRecipeRating = async (req: Request, res: Response) => {
    const recipeId = parseInt(req.params.id);
    try {
        const result = await prisma.recipeRating.aggregate({
            _avg: {
                rating: true
            },
            _count: {
                rating: true
            },
            where: {
                recipeId: recipeId
            }
        });
        res.json(result);
    } catch (error) {
        handleError(req, res, error);
    }
}

export const getRecipesByRating = async (req: Request, res: Response) => {
    const requestedRating = parseInt(req.params.rating);
    try {
        const result = await prisma.recipeRating.groupBy({
            by: ['recipeId'],
            where: {
                rating: requestedRating
            }
        });
        res.json(result);
    } catch (error) {
        handleError(req, res, error);
    }
}

export const getRecipesByTag = async (req: Request, res: Response) => {
    const tagName = req.params.name;
    try {
        const result = await prisma.tag.findMany({
            where: {
                name: tagName
            },
            include: {
                recipes: true
            }
        });
        res.json(result);
    } catch (error) {
        handleError(req, res, error);
    }
}

export const getRecipesByUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const result = await prisma.user.findUnique({
            where: {
                id
            },
            include: {
                recipes: true
            }
        });
        res.json(result);
    } catch (error) {
        handleError(req, res, error);
    }
}
