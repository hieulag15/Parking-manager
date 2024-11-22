import express from "express";
import parkingController from "../controllers/parkingController.js";
import { verifyTokenMidleware } from "../middlewares/verifytokenMidleware.js";

const router = express.Router();

router.post('/', verifyTokenMidleware.verifyTokenAndAdmin , parkingController.createParkingController);
router.get('/', verifyTokenMidleware.verifyToken, parkingController.getParkingByZoneController);
router.put('/', verifyTokenMidleware.verifyTokenAndAdmin, parkingController.updateParkingController);
router.delete('/', verifyTokenMidleware.verifyTokenAndAdmin, parkingController.deleteParkingController);

export const parkingRoute = router;