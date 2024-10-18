import { StatusCodes } from "http-status-codes";
import vehicleService from "../services/vehicleService.js";

const getVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.getVehicle(req.params._id);
    res.status(StatusCodes.OK).json(vehicle);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Error getting vehicle: ${error.message}` });
  }
}

const getVehicles = async (req, res) => {
  try {
    const status = req.query.status;
    const vehicles = await vehicleService.getVehicles(status);
    res.status(StatusCodes.OK).json(vehicles);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Error getting vehicles: ${error.message}` });
  }
}

const createVehicle = async (req, res) => {
  try {
    const newVehicle = await vehicleService.create(req.body);
    res.status(StatusCodes.CREATED).json(newVehicle);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Error creating vehicle: ${error.message}` });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const updatedData = req.body;
    const result = await vehicleService.updateVehicle(req.query._id, updatedData);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Error updating vehicle: ${error.message}` });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const result = await vehicleService.deleteVehicle(req.query._id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Error deleting vehicle: ${error.message}` });
  }
}

const vehicleController = {
  getVehicle,
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle
}

export default vehicleController;