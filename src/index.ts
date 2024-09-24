import express from 'express';
import cors from 'cors';
import path from 'path';
import { createRecipe, getRecipeRating, getRecipes, getRecipesByRating, getRecipesByTag, getRecipesByUser, rateRecipe } from './controllers/recipes';
import { handleLoginRequest, handleRegisterRequest } from './controllers/auth';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/corsOptions';

const app = express();
const PORT = process.env.PORT || 5050;

app.use(logger);
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/recipes', require('./routes/recipeRoutes'));
app.use('/auth', require('./routes/authRoutes'));

// app.post("/api/auth/login", handleLoginRequest);
// app.post("/api/auth/register", handleRegisterRequest);
// app.post("/auth/verify", handleVerifyRequest);
// app.get("/api/recipes", getRecipes);
// app.post("/api/recipes", createRecipe);

// app.post("/api/recipes/:id/rating", rateRecipe);
// app.get("/api/recipes/:id/rating", getRecipeRating);

// app.get("/api/recipes/rating/:rating", getRecipesByRating);
// app.get("/api/recipes/tag/:name", getRecipesByTag);
// app.get("/api/recipes/user/:id", getRecipesByUser);

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"))
    } else if (req.accepts("json")) {
        res.json({ message: "404 Not Found"})
    } else {
        res.type("txt").send("404 Not Found")
    }
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
