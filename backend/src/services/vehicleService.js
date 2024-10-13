import { StatusCodes } from "http-status-codes";
import Vehicle from "../models/vehicleModel.js"; // Adjust the import based on your project structure
import ApiError from "../utils/ApiError.js";
import { personModel } from "../models/personModel.js";

const findByLicensePlate = async (licensePlate) => {
  try {
    return await Vehicle.findOne({ licensePlate });
  } catch (error) {
    throw new Error(error.message);
  }
}

const updateDriverId = async (id, driverId) => {
  try {
    const updateVehicle = await Vehicle.updateOne(
      { _id: new ObjectId(id)},
      { $set: { driverId: new ObjectId(driverId) }}
    )
    return updateVehicle;
  } catch (error) {
    throw new Error(error.message);
  }
}

const createNew = async (data) => {
  try {
    // Kiểm tra đã có thông tin xe này chưa
    const existingVehicle = await findByLicensePlate(data.licensePlate);
    if (existingVehicle) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Đã có thông tin về xe này', 'Not Created', 'BR_parking_3');
    }

    // Tạo thông tin xe mới
    const newVehicle = await Vehicle.create(data);

    // // Thêm thông tin xe mới vào thông tin chủ xe
    // await personModel.addNewVehicle(data.driverId, newVehicle._id);

    return newVehicle;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Tạo thông tin xe mới không thành công', 'Not Created', 'BR_parking_3');
  }
};

export const vehicleService = {
  createNew,
  findByLicensePlate,
  updateDriverId,
};