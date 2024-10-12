import { createParkingTurn } from "../models/parkingTurnModel.js";

export const createParkingTurnController = async (req, res) => {
  try {
    const data = req.body;
    const newParkingTurn = await createParkingTurn(data);
    res.status(201).json(newParkingTurn);
  } catch (error) {
    res.status(500).json({ message: `Error creating parking turn: ${error.message}` });
  }
}