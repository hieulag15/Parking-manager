import express from "express";
import { vehicleController } from "../controllers/vehicleController.js";

const router = express.Router();

// Route to create a new vehicle
router.post('/', vehicleController.createVehicle);

// Route to get all vehicles
router.get('/', vehicleController.getAllVehicles);

// Route to get a vehicle by ID
router.get('/:_id', vehicleController.getVehicleById);

// Route to update a vehicle
router.put('/:_id', vehicleController.updateVehicle);

// Route to delete a specific vehicle
router.delete('/:_id', vehicleController.deleteVehicle);

// Route to delete all vehicles
router.delete('/all', vehicleController.deleteAllVehicles);

// Route to delete multiple vehicles
router.delete('/many', vehicleController.deleteManyVehicles);

export const vehicleRoute = router;