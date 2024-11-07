import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.post('/refresh-token', authController.refreshToken);
router.post('/authentication', authController.authentication);
router.post('/re-authentication', authController.reAuthentication);


export const authRoute = router;