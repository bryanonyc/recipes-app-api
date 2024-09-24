import express from 'express';
import { createRecipe, getRecipes, deleteRecipe } from '../controllers/recipes';
import { verifyJWT } from '../middleware/verifyJWT';
const router = express.Router();

router.use(verifyJWT);

// /recipes
router.route('/')
    .get(getRecipes);

// /recipes
router.route('/')
    .post(createRecipe);

// /recipes/:id/delete
router.route('/:id/delete')
    .delete(deleteRecipe);

// TODO
// POST /recipes/:id/rating, rateRecipe
// GET /recipes/:id/rating, getRecipeRating
// GET /recipes/rating/:rating, getRecipesByRating
// GET /recipes/tag/:name, getRecipesByTag
// GET /recipes/user/:id, getRecipesByUser

module.exports = router;
