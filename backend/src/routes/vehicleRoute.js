import express from "express";
import vehicleController from "../controllers/vehicleController.js";
import { verifyTokenMidleware } from "../middlewares/verifytokenMidleware.js";

const router = express.Router();

router.post('/', vehicleController.createVehicle);
router.get('/', verifyTokenMidleware.verifyTokenAndAdmin, vehicleController.getVehicles);
router.get('/:_id', verifyTokenMidleware.verifyToken, vehicleController.getVehicle);
router.put('/:_id', verifyTokenMidleware.verifyToken, vehicleController.updateVehicle);
router.delete('/:_id', verifyTokenMidleware.verifyTokenAndAdmin, vehicleController.deleteVehicle);

export const vehicleRoute = router;