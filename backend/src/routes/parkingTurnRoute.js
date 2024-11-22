import express from 'express';
import parkingTurnController from '../controllers/parkingTurnController.js';
import { verifyTokenMidleware } from '../middlewares/verifytokenMidleware.js';

const router = express.Router();

router.post('/', verifyTokenMidleware.verifyTokenAndAdmin, parkingTurnController.createParkingTurn);
router.get('/find-slot/:_parking_id', verifyTokenMidleware.verifyTokenAndAdmin, parkingTurnController.findEmptySlot);
router.get('/getVehicleInOutNumber', verifyTokenMidleware.verifyTokenAndAdmin, parkingTurnController.getVehicleInOutNumber);
router.get('/getVehicleInOutNumberByHour', verifyTokenMidleware.verifyTokenAndAdmin, parkingTurnController.getVehicleInOutNumberByHour);
router.get('/getRevenue', verifyTokenMidleware.verifyTokenAndAdmin, parkingTurnController.getRevenue);
router.get('/GetRevenueByHour', verifyTokenMidleware.verifyTokenAndAdmin, parkingTurnController.getRevenueByHour);
router.get('/', verifyTokenMidleware.verifyTokenAndAdmin, parkingTurnController.findVehicleInParkingTurn);

export const parkingTurnRoute = router;