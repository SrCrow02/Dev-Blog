import postsController from '../controllers/postsController';
import commentsController from '../controllers/commentsController';
import HELPERS from '../helpers/authVerify';
import express from 'express';

const routerNews = express.Router();

routerNews.post('/create', postsController.createPosts);
routerNews.get('/show', postsController.showPosts);
routerNews.put('/update', postsController.updatePosts);
routerNews.delete('/delete/:id', postsController.deletePosts);
routerNews.post('/create-comments/:id', HELPERS.verifyToken,  commentsController.createComment);

export default routerNews;