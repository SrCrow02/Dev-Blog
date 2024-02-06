import postsModel from '../models/postsModel';
import { Request, Response } from 'express';

class PostsController {
    static async createPosts(req: Request, res: Response) {
        const { title, content, author, category } = req.body;
        
        if (title && category) {
            const createPost = new postsModel.Posts({
                title: title,
                content: content,
                author: author, 
                category: category,
                comments: [{
                    text: 'DEFAULT',
                    author: 'DEFAULT'
                }]
            });

            createPost.save();

            res.status(200).json({ message: 'Post criado com sucesso'});
        }
    }

    static async showPosts(req: Request, res: Response) {
        try {
            const tasks = await postsModel.Posts.find();

            res.status(200).json(tasks);
        } catch(error) {
            console.log(error);
            res.status(500).json({ message: 'There was a error with the server!'});
        }
    }
    
    static async updatePosts(req: Request, res: Response) {
        const { title, content, author, category } = req.body;

        if (title && category) {

            const existingPost = await postsModel.Posts.findOne({ title: title });

            if (existingPost) {
                if (content) existingPost.content = content;
                if (author) existingPost.author = author;
                existingPost.category = category;

                await existingPost.save();

                return res.status(200).json({ message: 'Post atualizada com sucesso' });
            } else {
                return res.status(404).json({ message: 'Post não encontrada' });
            }
        }
    }

    static async deletePosts(req: Request, res: Response) {
        const id = req.params.id;
        try {
            if (id) {
                const existingPost = await postsModel.Posts.findById(id);

                if (existingPost) {
                    await existingPost.deleteOne();
                
                    res.status(200).json({ message: 'Post excluída com sucesso' });
                } else {
                    return res.status(404).json({ error: 'Post não encontrada' });
                }
            } else {
                res.status(400).json({ error: 'Informe o ID' });
            }
        } catch (err) {
            console.error(err); // Log the actual error for debugging
            res.status(500).json({ error: 'Erro no servidor' });
        }
    }
}

export default PostsController;