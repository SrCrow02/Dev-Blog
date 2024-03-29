import express from 'express';
import profileController from '../controllers/profileController';
import HELPERS from '../helpers/authVerify';
import BLACKLIST from '../helpers/blackList';

const routerProfile = express.Router();

routerProfile.put('/edit-profile/:id', HELPERS.verifyTokenWithId, HELPERS.verifyToken, BLACKLIST.blackListVerify, profileController.editProfile);
routerProfile.get('/show-profile/:id', HELPERS.verifyTokenWithId, HELPERS.verifyToken, BLACKLIST.blackListVerify, profileController.showPRofile);

export default routerProfile;