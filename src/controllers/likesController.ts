import postsModel from '../models/postsModel';
import { Request, Response } from 'express';
import userSchema from '../models/userSchema';

class likesController {
    static async addLike(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const email = req.body.email;
            
            const existingPost = await postsModel.Posts.findById(id);
            const user = await userSchema.User.findOne({ email: email });

            if (!user) {
                return res.status(400).json({ error: 'Usuario não existe'});
            }

            if (!existingPost) {    
                return res.status(400).json({ error: 'O post não existe'});
            }

            const index = existingPost.blackListLikes.findIndex(item => item.toLowerCase() === email.toLowerCase());

            const isInBlackListLikes = existingPost.blackListLikes.includes(email); 

            if (isInBlackListLikes) {
                existingPost.blackListLikes.splice(index, 1);
                existingPost.likes -= 1;
                existingPost.save();
                res.status(200).json({ message: 'Like retirado com sucesso!'});
                return;
            }

            if (existingPost) {
                existingPost.blackListLikes.push(email);
                existingPost.likes += 1;
                existingPost.save();
            }

            res.status(200).json({ message: 'Like adicionado com sucesso!'});
        } catch (err) {
            console.log(err);
        }
    }
}

export default likesController;