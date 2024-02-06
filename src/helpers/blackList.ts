import { NextFunction, Request, Response } from 'express';
import blackListModel from '../models/blackListModel';

class blackList {
    static async blackListVerify(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization; 
        const blackListedToken = await blackListModel.findOne({ token });

        if (blackListedToken) {
            return res.status(401).json({ error: 'Token invalido'});
        }
        next();
    }
}

export default blackList;