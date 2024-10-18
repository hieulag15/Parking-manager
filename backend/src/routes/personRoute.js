import express from "express";
import personController from "../controllers/personController.js";

const router = express.Router();

router.post("/", personController.createNew);

router.put("/", personController.updateUser);
router.delete("/", personController.deleteUser);

// router.get("/driver/filter", personController.findDriverByFilter);

// router.route('/addMany')
// .post(personController.createMany);

// router.route('/deleteMany')
// .post(personController.deleteMany);

// router.route('/deleteAll')
// .delete(personController.deleteAll);

export const personRoute = router;
