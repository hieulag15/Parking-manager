import express from 'express';
import authController from '../controllers/authController.js';
import { userValidation } from '../validations/personValidation.js';

const router = express.Router();

router.post('/login', userValidation.login, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/check-token', authController.checkToken);
router.post('/authentication', authController.authentication);
router.post('/re-authentication', authController.reAuthentication);


export const authRoute = router;