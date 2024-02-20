import postsModel from '../../models/postsModel';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

class PostsController {
    static async createPosts(req: Request, res: Response) {
        const { title, content, author, category } = req.body;

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }
        
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
        const { limit, offset } = req.query; 
        const category = req.query.category;
    
        let limitParse: number = Number(limit);
        let offsetParse: number = Number(offset);
        const categoryParser = String(category);

        if (!limit) {
            limitParse = 5;
        }

        if (!offset) {
            offsetParse = 0;
        }

        try {
            const posts = await postsModel.Posts.find().skip(offsetParse).limit(limitParse);
            if (category) {
                const posts_category = await postsModel.Posts.find({ category: categoryParser }).skip(offsetParse).limit(limitParse);
                return res.status(200).json({ message: posts_category});
            }

            res.status(200).json(posts);
        } catch(error) {
            console.log(error);
            res.status(500).json({ message: 'Erro no servidor!'});
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
            console.error(err); 
            res.status(500).json({ error: 'Erro no servidor' });
        }
    }
}

export default PostsController;