import express from "express";
import { vehicleController } from "../controllers/vehicleController.js";

const router = express.Router();

// Route to create a new vehicle
router.post('/', vehicleController.createVehicle);

// Route to get all vehicles
router.get('/', vehicleController.getVehicles);

// Route to update a vehicle
router.put('/:_id', vehicleController.updateVehicle);

// Route to delete a specific vehicle
router.delete('/:_id', vehicleController.deleteVehicle);

export const vehicleRoute = router;