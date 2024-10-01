import express from 'express';
import { createRecipe, getRecipes, deleteRecipe, updateRecipe, publishRecipe } from '../controllers/recipes';
import { verifyJWT } from '../middleware/verifyJWT';
const router = express.Router();

router.use(verifyJWT);

// /recipes
router.route('/')
    .get(getRecipes);

// router.route('/search')
//     .get(getRecipesBySearch);

// /recipes
router.route('/')
    .post(createRecipe);

// /recipes
router.route('/')
    .patch(updateRecipe);

// /recipes/publish
router.route('/publish')
    .patch(publishRecipe);

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
