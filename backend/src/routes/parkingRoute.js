import express from "express";
import { createParkingController, getParkingByZoneController } from "../controllers/parkingController.js";

const router = express.Router();

router.post('/', createParkingController);
router.get('/', getParkingByZoneController);

export const parkingRoute = router;