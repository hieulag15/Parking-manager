import express from 'express';
import parkingTurnController from '../controllers/parkingTurnController.js';

const router = express.Router();

router.post('/', parkingTurnController.createParkingTurnController);
router.post('/out', parkingTurnController.outParkingController);

export const parkingTurnRoute = router;