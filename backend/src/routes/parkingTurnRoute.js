import express from 'express';
import parkingTurnController from '../controllers/parkingTurnController.js';

const router = express.Router();

router.post('/', parkingTurnController.createParkingTurn);

export const parkingTurnRoute = router;