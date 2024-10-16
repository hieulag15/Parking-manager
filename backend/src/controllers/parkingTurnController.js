import { createParkingTurn, outParking } from "../services/parkingTurnService.js";

export const createParkingTurnController = async (req, res) => {
  try {
    const data = req.body;
    const newParkingTurn = await createParkingTurn(data);
    res.status(201).json(newParkingTurn);
  } catch (error) {
    res.status(500).json({ message: `Error creating parking turn: ${error.message}` });
  }
}

export const outParkingController = async (req, res) => {
  try {
    const data = req.body;
    const parkingTurn = await outParking(data);
    res.status(200).json(parkingTurn);
  } catch (error) {
    res.status(500).json({ message: `Error out parking: ${error.message}` });
  }
}