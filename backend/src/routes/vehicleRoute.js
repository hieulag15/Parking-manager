import express from "express";
import vehicleController from "../controllers/vehicleController.js";

const router = express.Router();

router.post('/', vehicleController.createVehicle);
router.get('/', vehicleController.getVehicles);
router.get('/:_id', vehicleController.getVehicle);
router.put('/:_id', vehicleController.updateVehicle);
router.delete('/:_id', vehicleController.deleteVehicle);

export const vehicleRoute = router;