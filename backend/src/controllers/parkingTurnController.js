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

const getVehicleInOutNumber = async (req, res, next) => {
  try {
    const data = req.body;

    const result = await parkingTurnService.getVehicleInOutNumber(data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: `Error getting vehicle in/out number: ${error.message}` });
  }
}

const getVehicleInOutNumberByHour = async (req, res, next) => {
  try {
    const data = req.body;

    const result = await parkingTurnService.getVehicleInOutNumberByHour(data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: `Error getting vehicle in/out number by hour: ${error.message}` });
  }
}

const getRevenue = async (req, res, next) => {
  try {
    const data = req.body;

    const result = await parkingTurnService.getRevenue(data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: `Error getting revenue: ${error.message}` });
  }
}

const GetRevenueByHour = async (req, res, next) => {
  try {
    const data = req.body;

    const result = await parkingTurnService.getRevenueByHour(data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: `Error getting revenue by hour: ${error.message}` });
  }
}

const findVehicleInParkingTurn = async (req, res, next) => {
  try {
    const licensePlate = req.query.licensePlate;
    const parkingTurn = await parkingTurnService.findVehicleInParkingTurn(licensePlate, next);
    res.status(200).json(parkingTurn);
  } catch (error) {
    res.status(500).json({ message: `Error getting parking turn by license plate: ${error.message}` });
  }
}

const parkingTurnController = {
  createParkingTurn,
  getVehicleInOutNumber,
  getVehicleInOutNumberByHour,
  getRevenue,
  GetRevenueByHour
  findVehicleInParkingTurn
}

export default parkingTurnController;