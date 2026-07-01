import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import morgan from 'morgan';
import pptRouter from './routes/ppt.js';
import userRouter from './routes/user.js';
import libraryRouter from "./routes/library.js";
import themeRouter from "./routes/theme.js";
import multer from 'multer';
configDotenv();

const app = express();
const PORT = process.env.PORT || 8080;
app.use(morgan('dev'))

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', process.env.FRONTEND_URL],
    credentials: true
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

app.use('/api/ppt', pptRouter);
app.use('/api/user', userRouter);
app.use('/api/library', libraryRouter);
app.use('/api/themes', themeRouter);

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File is too large. Maximum limit is 25 MB.' });
        }
        return res.status(400).json({ error: err.message });
    }
    if (err) {
        return res.status(400).json({ error: err.message });
    }

    next();
});

app.get('/', (req, res) => {
    res.send(`Hello world`);
});

app.listen(PORT, () => {
    console.log(`[Server] Web App running at http://localhost:${PORT}`);
});
