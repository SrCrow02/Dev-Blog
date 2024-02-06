import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTSECRET } from '../../config.json';

interface AuthRequest extends Request {
    user?: any; 
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

            req.user = decodedToken;
            next(); 
        });
    }

    /*   static async isAdmin(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization;

            jwt.verify(token, JWTSECRET, (decodedToken) => {
                const decoded = decodedToken;
                const role = decoded.role;


                if (role != 'Admin') {
                    return res.status(401).json({ error: 'Usuario sem permissões necessarias! '});
                }
            });

            next();
        } catch (err) {
            res.status(401).json('Erro no servidor!');
        }
    }   */
}

export default UserVerify;