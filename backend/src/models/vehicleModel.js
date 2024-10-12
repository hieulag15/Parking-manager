import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '../utils/validators.js';

const { Schema } = mongoose;
const ObjectId = mongoose.Types.ObjectId;


export const VEHICLE_COLLECTION_NAME = 'vehicles';

const vehicleSchema = new Schema({
  driverId: {
    type: String,
    match: [OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE],
    default: null,
  },
  licenePlate: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[0-9]{2}[A-Z]-[0-9]{4,5}$/,
  },
  type: {
    type: String,
    minlength: 2,
    maxlength: 20,
    trim: true,
    default: 'Car',
  },
  active: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  _destroy: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

vehicleSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: 'all',
});

const Vehicle = mongoose.model("Vehicles", vehicleSchema);

const findByLicensePlate = async (licenePlate) => {
  try {
    const vehicle = await Vehicle.findOne({ licenePlate: licenePlate})
    return vehicle;
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
    // Check if the license plate already exists
    const existingVehicle = await findByLicensePlate(data.licensePlate);
    if (existingVehicle) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "License plate already exists",
        "Conflict"
      );
    }

    // Create a new vehicle
    const newVehicle = await Vehicle.create(data);
    return newVehicle;
  } catch (error) {
    if (error.type && error.code) {
      throw new ApiError(
        error.statusCode,
        error.message,
        error.type,
        error.code
      );
    } else if (error.message.includes("E11000 duplicate key")) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "Duplicate license plate",
        "LicensePlate_Conflict",
        "LicensePlate_Conflict"
      );
    } else {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message,
        "Internal_Server_Error",
        "Internal_Server_Error"
      );
    }
  }
};

export const vehicleModel = {
  Vehicle,
  createNew,
  findByLicensePlate,
  updateDriverId,
};