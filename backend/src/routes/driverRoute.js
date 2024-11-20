import express from "express";
import personController from "../controllers/personController.js";
import { verifyTokenMidleware } from "../middlewares/verifytokenMidleware.js";

const router = express.Router();

router.post('/', personController.createNew);
router.get('/', verifyTokenMidleware.verifyToken, personController.findDriverByFilter);
router.delete('/', verifyTokenMidleware.verifyTokenAndAdmin, personController.deleteDriver);
router.put('/', verifyTokenMidleware.verifyToken, personController.updateDriver);

export const driverRoute = router;