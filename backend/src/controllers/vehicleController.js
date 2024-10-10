import { StatusCodes } from "http-status-codes";
import { vehicleService } from "../services/vehicleService.js"; // Adjust the import based on your project structure

export const createVehicle = async (req, res) => {
  try {
    const newVehicle = await vehicleService.createVehicle(req.body);
    res.status(StatusCodes.CREATED).json(newVehicle);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Error creating vehicle: ${error.message}` });
  }
};

export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res.status(StatusCodes.OK).json(vehicles);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Error getting vehicles: ${error.message}` });
  }
};

export const getVehicleById = async (req, res) => {
  try {
    const { _id } = req.query;
    const vehicle = await vehicleService.getVehicleById(_id);
    res.status(StatusCodes.OK).json(vehicle);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Error getting vehicle: ${error.message}` });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const updatedData = req.body;
    const result = await vehicleService.updateVehicle(req.query._id, updatedData);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Error updating vehicle: ${error.message}` });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const result = await vehicleService.deleteVehicle(req.query._id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Error deleting vehicle: ${error.message}` });
  }
};

export const deleteAllVehicles = async (req, res) => {
  try {
    const result = await vehicleService.deleteAllVehicles();
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Error deleting all vehicles: ${error.message}` });
  }
};

export const deleteManyVehicles = async (req, res) => {
  try {
    const ids = req.body.ids;
    const result = await vehicleService.deleteMany(ids);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Error deleting many vehicles: ${error.message}` });
  }
};

export const vehicleController = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  deleteAllVehicles,
  deleteManyVehicles,
};