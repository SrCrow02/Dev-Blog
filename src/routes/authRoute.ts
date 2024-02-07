import express from 'express';
import UserController from '../controllers/authController';
import HELPERS from '../helpers/authVerify';
import BLACKLIST from '../helpers/blackList';
import { body } from 'express-validator';

const router = express.Router();

router.post('/register', [
    body('email').isEmail().withMessage('O email é invalido'),
    body('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres')
], UserController.createUser);
router.post('/login', UserController.loginUser);
router.post('/logout', UserController.logout);
router.get('/', BLACKLIST.blackListVerify,  HELPERS.verifyToken);

export default router;