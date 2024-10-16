import express from 'express';
import { createParkingTurnController, outParkingController } from '../controllers/parkingTurnController.js';

const router = express.Router();

router.post('/', createParkingTurnController);
router.post('/out', outParkingController);

export const parkingTurnRoute = router;