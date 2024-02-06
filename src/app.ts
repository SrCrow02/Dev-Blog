import express from 'express';
import { PORT } from '../config.json';

import db from './database/db';

import router from './routes/authRoute';
import postsRoute from './routes/postsRoute';

const app = express();

app.use(express.json());

db.startDb();

// Routes
app.use('/auth', router);
app.use('/posts', postsRoute);

app.listen(PORT, () => {
    console.log(`Estou rodando na porta ${PORT}`);
});