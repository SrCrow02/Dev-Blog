import userSchema from '../../models/userSchema';
import { Request, Response } from 'express';
import { getRedis } from '../../redisConfig';

class profileController {
    static async editProfile(req: Request, res: Response) {
        const { id } = req.params;
        const { name, bio, avatar } = req.body;
        
        try {
            const user = await userSchema.User.findById(id);

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            if (name) user.name = name;
            if (bio) user.bio = bio;
            if (avatar) user.avatar = avatar;

            await user.save();

            res.status(200).json({ message: 'Perfil atualizado com sucesso' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Houve um erro no servidor' });
        }
    }

    static async showPRofile(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const user = await userSchema.User.findById(id);

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const userRedis = await getRedis(`user-${id}`);
            const userParse = JSON.stringify(userRedis);

            if (userRedis) {
                return res.status(200).json({ message: userParse });
            }

            return res.status(200).json({ message: user });
            
            

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Houve um erro no servidor' });
        }
    }
}

export default profileController;