import express from 'express';
import parkingTurnController from '../controllers/parkingTurnController.js';
import { verifyTokenMidleware } from '../middlewares/verifytokenMidleware.js';

const router = express.Router();

router.post('/', verifyTokenMidleware.verifyTokenAndAdmin, parkingTurnController.createParkingTurn);
router.get('/', verifyTokenMidleware.verifyTokenAndAdmin, parkingTurnController.findVehicleInParkingTurn);

export const parkingTurnRoute = router;