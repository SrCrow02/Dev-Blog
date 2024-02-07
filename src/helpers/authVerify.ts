import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWTSECRET } from '../../config.json';

interface AuthRequest extends Request {
    user?: JwtPayload;
}

class UserVerify {
    static async verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        jwt.verify(token, JWTSECRET, (err, decodedToken) => {
            if (err) {
                return res.status(403).json({ message: 'Token inválido' });
            }

            req.user = decodedToken as JwtPayload; 
            next(); 
        });
    }

    static async verifyTokenWithId(req: AuthRequest, res: Response, next: NextFunction) {
        const token = req.headers.authorization;
        const id = req.params.id;

        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        try {
            jwt.verify(token, JWTSECRET, (err, decodedToken) => {
                if (err) {
                    return res.status(403).json({ message: 'Token inválido' });
                }

                const user = decodedToken as JwtPayload; 

                if (user.userId !== id) {
                    console.log(user.userId, id);
                    return res.status(403).json({ message: 'Usuário não autorizado para acessar este recurso' });
                }

                next();
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
    }
}

export default UserVerify;
