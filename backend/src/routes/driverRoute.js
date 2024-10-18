import express from "express";
import personController from "../controllers/personController.js";

const router = express.Router();

router.get("/filter", personController.findDriverByFilter);

router.delete("/", personController.deleteDriver)

export const driverRoute = router;