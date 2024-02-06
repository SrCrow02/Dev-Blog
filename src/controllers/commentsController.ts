import postsModel from '../models/postsModel';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWTSECRET } from '../../config.json';
import userSchema from '../models/userSchema';
import authVerify from '../helpers/authVerify';

interface TokenPayload {
    userId: string;
}

class commentsController {
    static async createComment(req: Request, res: Response) {
        const { text } = req.body; // Modificado de content para text para corresponder ao erro
        const token = req.headers.authorization;
        const id = req.params.id;

        try {
            if (!token) throw new Error('Token not provided');

            if (!JWTSECRET) throw new Error('JWTSECRET not provided');

            const decoded = jwt.verify(token, JWTSECRET) as TokenPayload;

            const user = decoded.userId;

            if (id) {
                const post = await postsModel.Posts.findById(id);
                if (!post) throw new Error('Post not found');

                const newComment = {
                    text: text, // Modificado de content para text para corresponder ao erro
                    author: user
                };

                post.comments.push(newComment); // Adiciona o novo comentário ao array de comentários do post
                await post.save(); // Salva o post atualizado com o novo comentário
            }

            res.status(200).json({ message: 'Comentário adicionado com sucesso' });
        } catch (err) {
            console.log(err);
            res.status(400).json({ error: err });
        }
    }
}

export default commentsController;