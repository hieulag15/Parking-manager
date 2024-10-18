import e from "express";
import parkingTurnService from "../services/parkingTurnService.js";

const createParkingTurnController = async (req, res) => {
  try {
    const data = req.body;
    const newParkingTurn = await parkingTurnService.create(data);
    res.status(201).json(newParkingTurn);
  } catch (error) {
    res.status(500).json({ message: `Error creating parking turn: ${error.message}` });
  }
}

const outParkingController = async (req, res) => {
  try {
    const data = req.body;
    const parkingTurn = await parkingTurnService.outParking(data);
    res.status(200).json(parkingTurn);
  } catch (error) {
    res.status(500).json({ message: `Error out parking: ${error.message}` });
  }
}

const parkingTurnController = {
  createParkingTurnController,
  outParkingController
}

export default parkingTurnController;