import express from 'express';
import cors from 'cors';
import path from 'path';
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
