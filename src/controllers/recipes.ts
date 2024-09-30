import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { handleError } from '../middleware/errorHandler';
import { getUserInfoFromToken } from '../middleware/verifyJWT';

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
                .status(403)
                .json({
                    message: "No account found. Only registered users can submit recipes.",
                    isError: true,
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
                tags
            }
        });
        res.json(result);
    } catch (error) {
        handleError(req, res, error);
    }
}

export const updateRecipe = async (req: Request, res: Response) => {
    const {
        id,
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
            return res
                .status(403)
                .json({
                    message: "No account found. Only registered users can edit recipes.",
                    isError: true,
                });
        }

        const recipe = await prisma.recipe.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        email: true,
                    }
                }
            }
        });

        if (email !== recipe?.author.email) {
            return res
                .status(403)
                .json({
                    message: "You are not authorized to access this resource.",
                    isError: true,
                });
        }

        const result = await prisma.recipe.update({
            where: {
                id,
            },
            data: {
                title,
                description,
                ingredients,
                directions,
                prepTime,
                cookTime,
                totalTime,
                servings,
                tags
            }
        });
        res.json(result);
    } catch (error) {
        handleError(req, res, error);
    }
}

export const publishRecipe = async (req: Request, res: Response) => {
    const {
        id,
        author,
    } = req.body;

    const { email } = author;

    try {
        let user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (user === null || !user.isAdmin) {
            res
                .status(403)
                .json({
                    message: "Only authorized users can use this resource.",
                    isError: true,
                });
        }

        const result = await prisma.recipe.update({
            where: {
                id,
            },
            data: {
                isPublished: true
            }
        });
        res.json(result);
    } catch (error) {
        handleError(req, res, error);
    }
}


export const deleteRecipe = async (req: Request, res: Response) => {
    const recipeId = parseInt(req.params.id);

    if (!recipeId) {
        return res.status(400).json({
            message: 'recipeId is required',
            isError: true
        });
    }

    try {
        const userInfo = await getUserInfoFromToken(req);
        console.log(userInfo);

        const recipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
            include: {
                author: {
                    select: {
                        email: true,
                    }
                }
            }
        });

        if (!userInfo?.isAdmin && userInfo?.email !== recipe?.author.email) {
            res
                .status(403)
                .json({
                    message: "You are not authorized to access this resource.",
                    isError: true,
                });
        } else {
            const result = await prisma.recipe.delete({
                where: { id: recipeId }
            });
            res.json(result);
        }
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
        const result = await prisma.recipe.findMany({
            where: {
                tags: {
                    search: tagName,
                }
            },
        });
        res.json(result);
    } catch (error) {
        handleError(req, res, error);
    }
}

export const getRecipesBySearch = async (req: Request, res: Response) => {
    if (req.query instanceof URLSearchParams && req.query.has("term")) {
        const searchTerm = req.query.get("term")!;
        try {
            const result = await prisma.recipe.findMany({
                where: {
                    isPublished: true,
                    title: {
                        search: searchTerm,
                    },
                    description: {
                        search: searchTerm,
                    },
                    ingredients: {
                        search: searchTerm,
                    },
                    directions: {
                        search: searchTerm,
                    },
                    tags: {
                        search: searchTerm,
                    }
                },
            });
            res.json(result);
        } catch (error) {
            handleError(req, res, error);
        }
    } else {
        res
            .status(400)
            .json({
                message: 'Please ensure the query parameter `term` is provided and set.',
                isError: true
            });
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
