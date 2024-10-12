import { StatusCodes } from "http-status-codes";
import { vehicleModel } from "../models/vehicleModel.js"; // Adjust the import based on your project structure
import ApiError from "../utils/ApiError.js";

// Create a new vehicle
const createVehicle = async (data) => {
  try {
    const existingVehicle = await vehicleModel.createNew(data);
    if (!existingVehicle) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Can't create vehicle",
        "Not created",
        "BR_vehicle_2"
      );
    }
    return existingVehicle;
  } catch (error) {
    handleError(error);
  }
};

// Update vehicle
const updateVehicle = async (_id, params) => {
  try {
    const vehicle = await vehicleModel.updateVehicle(_id, params);
    if (!vehicle) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Vehicle not found",
        "Not found",
        "BR_vehicle_1"
      );
    }
    return vehicle;
  } catch (error) {
    handleError(error);
  }
};

// Delete vehicle
const deleteVehicle = async (_id) => {
  try {
    const vehicle = await vehicleModel.deleteVehicle(_id);
    if (!vehicle) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Delete vehicle failed",
        "Not deleted",
        "BR_vehicle_4"
      );
    }
    return vehicle;
  } catch (error) {
    handleError(error);
  }
};

// Delete all vehicles
const deleteAllVehicles = async () => {
  try {
    const vehicles = await vehicleModel.deleteAll();
    if (!vehicles) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Delete all vehicles failed",
        "Not deleted",
        "BR_vehicle_4"
      );
    }
    return vehicles;
  } catch (error) {
    handleError(error);
  }
};

// Error handling function
const handleError = (error) => {
  if (error.type && error.code) {
    throw new ApiError(
      error.statusCode,
      error.message,
      error.type,
      error.code
    );
  } else {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const vehicleService = {
  createVehicle,
  updateVehicle,
  deleteVehicle,
  deleteAllVehicles,
};