import express from "express";
import eventController from "../controllers/eventController.js";

const router = express.Router();

router.get('/', eventController.getEvent);
router.post('/', eventController.createEvent);

export const eventRoute = router;