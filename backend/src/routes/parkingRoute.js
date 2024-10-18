import express from "express";
import parkingController from "../controllers/parkingController.js";

const router = express.Router();

router.post('/', parkingController.createParkingController);
router.get('/', parkingController.getParkingByZoneController);

export const parkingRoute = router;