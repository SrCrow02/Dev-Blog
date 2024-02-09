import postsController from '../controllers/postsController';
import commentsController from '../controllers/commentsController';
import HELPERS from '../helpers/authVerify';
import express from 'express';

const routerPosts = express.Router();

routerPosts.post('/create', postsController.createPosts);
routerPosts.get('/show', postsController.showPosts);
routerPosts.put('/update', postsController.updatePosts);
routerPosts.delete('/delete/:id', postsController.deletePosts);

routerPosts.post('/create-comments/:id', HELPERS.verifyToken, commentsController.createComment);
routerPosts.get('/show-comments', HELPERS.verifyToken, commentsController.showComment);
routerPosts.delete('/delete-comments/:postId/:commentId', HELPERS.verifyToken, commentsController.deleteComment);


export default routerPosts;