import express from 'express';
import { createParkingTurnController } from '../controllers/parkingTurnController.js';

const router = express.Router();

router.post('/', createParkingTurnController);

export const parkingTurnRoute = router;