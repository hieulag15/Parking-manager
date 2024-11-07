import express from "express";
import eventController from "../controllers/eventController.js";
import { verifyTokenMidleware } from "../middlewares/verifytokenMidleware.js";

const router = express.Router();

router.get('/', verifyTokenMidleware.verifyToken, eventController.getEvent);
router.post('/', verifyTokenMidleware.verifyTokenAndAdmin, eventController.createEvent);

export const eventRoute = router;