import express from "express";
import { createParkingController } from "../controllers/parkingController.js";

const Router = express.Router();

Router.router('/')
    .post(createParkingController);

export const parkingRoute = Router;