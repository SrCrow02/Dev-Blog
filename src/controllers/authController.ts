import userSchema from '../models/userSchema';
import { Request, Response } from 'express';
import { hashSync, compareSync } from 'bcrypt';
import { JWTSECRET } from '../../config.json';
import jwt from 'jsonwebtoken';
import blackListModel from '../models/blackListModel';

class UserController {
    static async createUser(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            if (email && password) {

                const hashPassword = hashSync(password, 10);

                if (!email) {
                    return res.status(400).json({ error: 'O email é obrigatório' });
                }

                if (!password) {
                    return res.status(400).json({ error: 'A senha é obrigatória' });
                }

                const newUser = new userSchema.User({
                    email: email,
                    password: hashPassword,
                    loginAttempt: 0,
                    lastLoginAttempt: 0,
                    loginAttempts: 0
                });

                await newUser.save();
                return res.status(200).json({ message: 'Usuário criado com sucesso'});
            } else {
                return res.status(400).json({ error: 'Email e senha são obrigatórios' });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao criar o usuário'});
        }
    }


    static async loginUser(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            if (!email || !password) {
                res.status(401).json({ error: 'Por favor, digite os dados necessarios!'});
            }

            const user = await userSchema.User.findOne({ email });

            if (user) {
                const isCorrectPassword = compareSync(password, user.password);

                if (!isCorrectPassword) {
                    return res.status(401).json({ error: 'Credenciais invalidas'});
                } else {
                    user.loginAttempts = 0;
                    user.save();

                    const payload = {
                        userId: user._id,
                        role: 'User'
                    };

                    const token = jwt.sign(payload, JWTSECRET, { expiresIn: '1h' });
                    
                    res.json(token);
                }
            }
        } catch(err) {
            res.status(403).json({ error: 'Erro no servidor' });
            console.log(err);
        }
    }

    static async logout(req: Request, res: Response) {
        const token = req.headers.authorization; 
        try {
            const token_db = new blackListModel({
                token: token
            });

            await token_db.save();

            res.status(200).json({ message: 'Logout feito com sucesso!'});
        } catch (err) {
            res.status(401).json({ error: 'Erro no servidor, ou token não fornecido!'});
        }
    }
}

export default UserController;