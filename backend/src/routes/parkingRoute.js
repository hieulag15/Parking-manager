import express from "express";
import parkingController from "../controllers/parkingController.js";
import { verifyTokenMidleware } from "../middlewares/verifytokenMidleware.js";

const router = express.Router();

router.post('/', verifyTokenMidleware.verifyTokenAndAdmin , parkingController.createParkingController);
router.get('/', verifyTokenMidleware.verifyToken, parkingController.getParkingByZoneController);

export const parkingRoute = router;