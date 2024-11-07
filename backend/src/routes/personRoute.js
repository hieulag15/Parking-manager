import express from "express";
import personController from "../controllers/personController.js";

const router = express.Router();

router.post("/", personController.createNew);
router.put("/", personController.updateUser);
router.delete("/", personController.deleteUser);

export const personRoute = router;
