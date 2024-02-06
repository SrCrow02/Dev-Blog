import express from 'express';
import UserController from '../controllers/authController';
import HELPERS from '../helpers/authVerify';
import BLACKLIST from '../helpers/blackList';

const router = express.Router();

router.post('/register', UserController.createUser);
router.post('/login', UserController.loginUser);
router.post('/logout', UserController.logout);
router.get('/', BLACKLIST.blackListVerify,  HELPERS.verifyToken);

export default router;