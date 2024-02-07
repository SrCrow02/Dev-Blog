import postsModel from '../models/postsModel';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWTSECRET } from '../../config.json';

interface TokenPayload {
    userId: string;
}

class commentsController {
    static async createComment(req: Request, res: Response) {
        const { text } = req.body; 
        const token = req.headers.authorization;
        const id = req.params.id;

        try {
            if (!token) throw new Error('Token não providenciado');

            if (!JWTSECRET) throw new Error('JWTSECRET não providenciado');

            const decoded = jwt.verify(token, JWTSECRET) as TokenPayload;

            const user = decoded.userId;

            if (id) {
                const post = await postsModel.Posts.findById(id);
                if (!post) throw new Error('Post não encontrado!');

                const newComment = {
                    text: text,
                    author: user
                };

                post.comments.push(newComment); 
                await post.save();
            }

            res.status(200).json({ message: 'Comentário adicionado com sucesso' });
        } catch (err) {
            console.log(err);
            res.status(400).json({ error: err });
        }
    }

    static async showComment(req: Request, res: Response) {
        try {
            const comments = await postsModel.Posts.find({}, { comments: 1 });

            res.status(200).json(comments);
        } catch(error) {
            console.log(error);
            res.status(500).json({ message: 'Houve um erro no servidor!'});
        }
    }

    static async deleteComment(req: Request, res: Response) {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        try {
            if (postId && commentId) {
                const post = await postsModel.Posts.findById(postId);

                if (!post) {
                    return res.status(404).json({ error: 'Post não encontrado' });
                }
                
                const commentIndex = post.comments.findIndex(comment => comment.id === commentId);

                if (commentIndex === -1) {
                    return res.status(404).json({ error: 'Comentário não encontrado' });
                }

                post.comments.splice(commentIndex, 1);

                await post.save();

                res.status(200).json({ message: 'Comentário deletado com sucesso' });
            } else {
                res.status(400).json({ error: 'ID do post ou do comentário não fornecido' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro no servidor' });
        }
    }

}

export default commentsController;