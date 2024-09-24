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

module.exports = router;
