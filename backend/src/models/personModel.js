import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import mongoose_delete from "mongoose-delete";
import Vehicle from "./vehicleModel.js";
import { vehicleService } from "../services/vehicleService.js";
import { PERSON_COLLECTION_NAME, VEHICLE_COLLECTION_NAME } from '../constant/index.js';

const ObjectId = mongoose.Types.ObjectId;

const personSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 50,
      trim: true,
    },
    address: { type: String, maxlength: 50, trim: true, default: "" },
    phone: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 11,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 200,
      trim: true,
      unique: true,
    },
    gender: { type: String, minlength: 1, maxlength: 20, trim: true },
    avatar: { type: String, maxlength: 50, trim: true, default: "" },
    account: {
      username: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 30,
        trim: true,
      },
      password: {
        type: String,
        required: true,
        minlength: 20,
        maxlength: 100,
        trim: true,
      },
      role: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
        trim: true,
      },
    },
    driver: {
      vehicleIds: [
        { 
          type: mongoose.Schema.Types.ObjectId,
          ref: VEHICLE_COLLECTION_NAME,
          required: true 
        },
      ],
      job: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
        trim: true,
      },
      department: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

personSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: "all",
});

const Person = mongoose.model(PERSON_COLLECTION_NAME, personSchema);

const createDriver = async (data, licenePlate, job, department) => {
  try {
    const vehicle = await vehicleService.findByLicensePlate(licenePlate);
    if (!vehicle) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Vehicle not found",
        "Not found",
        "BR_vehicle_1"
      );
    }

    if (vehicle.driverId != null) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Vehicle already has a driver",
        "Conflict",
        "BR_vehicle_2"
      );
    }

    data.driver = {
      vehicleId: vehicle._id.toString(),
      job: job,
      department: department,
    };
    data.driver.vehicleId = mongoose.Types.ObjectId(data.driver.vehicleId);
    const createNewDriver = await Person.create(data);

    const updateVehicle = await vehicleService.updateDriverId(
      data.driver.vehicleId,
      createNewDriver._id
    );

    if (updateVehicle.modifiedCount == 0) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Update vehicle driverId failed",
        "Internal Server Error",
        "BR_vehicle_3"
      );
    }

    return createNewDriver;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const updateDriver = async (_id, data, licenePlate, job, department) => {
  delete data._id;
  data.updateAt = Date.now();
  const findDriver = await Person.findOne({ _id: new ObjectId(_id) });
  if (!findDriver) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Driver not found",
      "Not found",
      "BR_person_1"
    );
  }

  const findVehicle = await Vehicle.findOne({ licenePlate: licenePlate });
  let vehicleId = findDriver.driver.vehicleId;
  if (findVehicle == null) {
    const createVehicle = await vehicleModel.createNew({
      licenePlate: licenePlate,
      type: "Car",
      driverId: findDriver._id,
    });

    vehicleId = createVehicle.insertedId;
    await vehicleModel.deleteOne(findDriver.driver.vehicleId);
  } else if (findVehicle.driverId == null) {
    //Neu xe ton tai nhung chua co chu
    const update = await Vehicle.updateDriverId(
      findVehicle._id,
      findDriver._id
    );
    vehicleId = findVehicle._id;
    await vehicleModel.deleteOne(findDriver.driver.vehicleId);
  } else if (!findVehicle.driverId.equals(findDriver._id)) {
    //Neu xe ton tai nhung co chu khac roi
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Vehicle already has a driver",
      "Conflict",
      "BR_vehicle_2"
    );
  } else if (findVehicle.driverId.equals(findDriver._id)) {
    //Neu xe ton tai va la xe cua chu nay
    vehicleId = findVehicle._id.toString();
  }

  data = {
    ...data,
    driver: {
      vehicleId: vehicleId,
      job: job,
      department: department,
    },
  };

  data.updateAt = Date.now();
  data.driver.vehicleId = new ObjectId(vehicleId);

  try {
    const updateOperation = {
      $set: {
        ...data,
      },
    };
    const result = await Person.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      updateOperation,
      { new: true }
    );
    return result;
  } catch (err) {
    throw new Error(err);
  }
};


const deleteDriver = async (_id) => {
  try {
    const driver = await Person.findOne(
      { _id: new ObjectId(_id) ,
      driver: { $exists: true}
      }
    )
    if (driver) {
      if (driver.driver.vehicleId) {
        const updateId = await vehicleModel.updateOne({ _id: new ObjectId(driver.driver.vehicleId)}, { $set: { driverId: null}});
      } 
    } else {
      throw new ApiError('Driver not exist');
    }
    const result = await Person.deleteOne({ _id: new ObjectId(_id)});
    return result;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
}

const deleteDrivers = async (_ids) => {
  try {
    // update lai nhung xe co Id la nguoi dung muon xe tro thanh xe khong chu
    const drivers = _ids.map((_ids) => new ObjectId(_ids));
    const updateid = await Vehicle.updateMany({ driverId: { $in: drivers }}, { $set: { driverId: null}});
    const result = await Person.deleteMany({ _id: { $in: drivers}});
    return result;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
}

export const personModel = {
  createDriver,
  deleteDriver,
  deleteDrivers,
  updateDriver,
};

export default Person;
