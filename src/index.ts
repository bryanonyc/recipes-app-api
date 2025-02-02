import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/corsOptions';

const PORT = process.env.PORT || 5050;
const HOST = process.env.HOST || '127.0.0.1';

const app = express();
app.set("query parser", (queryString: any) => {
    return new URLSearchParams(queryString);
});
// app.set('trust proxy', true);

app.use(logger);
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/', require('./routes/root'))
app.use('/recipes', require('./routes/recipeRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'))

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts("json")) {
        res.json({ message: "404 Not Found" })
    } else if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"))
    } else {
        res.type("txt").send("404 Not Found")
    }
});

app.use(errorHandler);

app.listen(Number(PORT), HOST, () => {
    console.log(`Server running on port ${ PORT }`);
});
