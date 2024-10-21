import express from "express";
import personController from "../controllers/personController.js";

const router = express.Router();

router.post("/", personController.createNew);
router.get("/filter", personController.findDriverByFilter);
router.delete("/", personController.deleteDriver);
router.put("/", personController.updateDriver);

export const driverRoute = router;