import express from 'express';
import { PORT } from '../config.json';
import swaggerUi from 'swagger-ui-express';

import db from './database/db';

import router from './routes/authRoute';
import postsRoute from './routes/postsRoute';
import routerProfile from './routes/profileRoute';

import swaggetDocs from './swagger.json';

const app = express();

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggetDocs));

db.startDb();

// Routes
app.use('/auth', router);
app.use('/posts', postsRoute);
app.use('/user', routerProfile);

app.listen(PORT, () => {
    console.log(`Estou rodando na porta ${PORT}`);
});