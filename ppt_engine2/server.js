import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import morgan from 'morgan';
import pptRouter from './routes/ppt.js';
import userRouter from './routes/user.js';
configDotenv();

const app = express();
const PORT = process.env.PORT || 8080;
app.use(morgan('dev'))

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/ppt', pptRouter);
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
    res.send(`Hello world`);
});

app.listen(PORT, () => {
    console.log(`[Server] Web App running at http://localhost:${PORT}`);
});
