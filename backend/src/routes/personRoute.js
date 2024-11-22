import express from "express";
import personController from "../controllers/personController.js";
import { verifyTokenMidleware } from "../middlewares/verifytokenMidleware.js";

const router = express.Router();

router.post('/', personController.createNew);
router.put('/', verifyTokenMidleware.verifyToken, personController.updateUser);
router.delete('/', verifyTokenMidleware.verifyTokenAndAdmin, personController.deleteUser);
router.get('/', verifyTokenMidleware.verifyToken, personController.findById);

export const personRoute = router;
