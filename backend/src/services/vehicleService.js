import { StatusCodes } from "http-status-codes";
import Vehicle from "../models/vehicleModel.js"; // Adjust the import based on your project structure
import ApiError from "../utils/ApiError.js";
import Parking from "../models/parkingModel.js";
import ParkingTurn from "../models/parkingTurnModel.js";


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

const create = async (data) => {
  try {
    // Kiểm tra đã có thông tin xe này chưa
    const existingVehicle = await findByLicensePlate(data.licensePlate);
    if (existingVehicle) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Đã có thông tin về xe này', 'Not Created', 'BR_parking_3');
    }

    // Tạo thông tin xe mới
    const newVehicle = await Vehicle.create(data);

    // Thêm thông tin xe mới vào thông tin chủ xe
    // await personModel.addNewVehicle(data.driverId, newVehicle._id);

    return newVehicle;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Tạo thông tin xe mới không thành công', 'Not Created', 'BR_parking_3');
  }
};

const getVehicle = async (vehicleId) => {
  try {
    return await Vehicle.findById(vehicleId)
  } catch (error) {
    throw new Error(error.message)
  }
}

const getVehicles = async (status) => {
  try {
    if (!status || status.trim() === '') {
      return await Vehicle.find();
    }

    if (status === 'in') {
      return await getVehiclesInParking();
    }

    if (status === 'out') {
      return await getVehiclesOutParking();
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

const getVehiclesInParking = async () => {
  try {
    const parkings = await Parking.find().populate({
      path: 'slots.parkingTurnId',
      model: ParkingTurn,
      populate: {
        path: 'vehicleId',
        model: Vehicle,
      }
    });

    const parkingObject = parkings.map(parking => parking.toObject());
    const slots = parkingObject.map(parking => parking.slots).flat();
    const blankSlots = slots.filter(slot => slot.isBlank === false);
    const vehicles = blankSlots.map(slot => {
      if (slot.parkingTurnId && slot.parkingTurnId.vehicleId) {
          return slot.parkingTurnId.vehicleId;
      } else {
          return null;
      }
    });

    return vehicles;
  } catch (error) {
    throw new Error(error.message);
  }
}

const getVehiclesOutParking = async () => {
  try {
    const allVehicles = await Vehicle.find();
    const vehiclesInParking = await getVehiclesInParking();

    const vehiclesInParkingIds = vehiclesInParking.map(vehicle => vehicle._id.toString());

    const vehiclesNotInParking = allVehicles.filter(vehicle => 
      !vehiclesInParkingIds.includes(vehicle._id.toString())
    );

    return vehiclesNotInParking;
  } catch (error) {
    throw new Error(error.message);
  }
}

const getListVehicleByVehicleIds = async (ids) => {
  try {
    return await Vehicle.find({ _id: { $in: ids }});
  } catch (error) {
    throw new Error(error.message);
  }
}

const vehicleService = {
  createNew,
  findByLicensePlate,
  updateDriverId,
  getVehicles,
  getListVehicleByVehicleIds,
};

export default vehicleService;