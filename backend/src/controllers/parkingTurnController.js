import parkingTurnService from "../services/parkingTurnService.js";
import { server } from "../server.js";

const createParkingTurn = async (req, res, next) => {
  try {
    const data = req.body;
    const action = req.query.action;
    let parkingTurn;

    if (action === 'in') {
      if (!data.position) {
        parkingTurn = await parkingTurnService.createWithoutPosition(data, next);
      } else {
        parkingTurn = await parkingTurnService.create(data, next);
      }
    } 
    if (action === 'out') {
      parkingTurn = await parkingTurnService.outParking(data, next);
    }
    server.io.emit('parkingUpdated');
    server.io.emit('notification-parking', { message: 'Car enters the parking lot' })
    res.status(201).json(parkingTurn);
  } catch (error) {
    res.status(500).json({ message: `Error creating parking turn: ${error.message}` });
  }
}

const parkingTurnController = {
  createParkingTurn
}

export default parkingTurnController;