import express from "express";
import { createParkingController, getParkingByZoneController, getAllParkingController } from "../controllers/parkingController.js";

const router = express.Router();

router.post('/', createParkingController);
router.get('/', (req, res, next) => {
    if (req.query.zone) {
      return getParkingByZoneController(req, res, next);
    } else {
      return getAllParkingController(req, res, next);
    }
  });

export const parkingRoute = router;