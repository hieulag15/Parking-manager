import { StatusCodes } from "http-status-codes";
import Person from "../models/personModel.js";
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError.js";
import vehicleService from "./vehicleService.js";
import Vehicle from "../models/vehicleModel.js";

const createUser = async (data) => {
  try {

    if (data.account) {
      const hashed = await hashPassword(data.account.password);
      data.account.password = hashed;
    }

    const createUser = await Person.create(data);
    if (createUser.acknowledge == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Can't create user",
        "Not create",
        "BR_person_2"
      );
    }

    //update driver
    if (data.vehicles && Array.isArray(data.vehicles)) {
      console.log(data.vehicles);
      for (const vehicleData of data.vehicles) {
        console.log("Processing license plate:", vehicleData.licensePlate);
        let vehicle = await vehicleService.findByLicensePlate(vehicleData.licensePlate);
        if (!vehicle) {
          console.log("Vehicle not found, creating new vehicle");
          vehicle = await vehicleService.create({
            driverId: createUser._id,
            licensePlate: vehicleData.licensePlate,
            type: vehicleData.type,
          });
          console.log("New vehicle created:", vehicle);
        } else {
          console.log("Vehicle found:", vehicle);
          await vehicleService.updateDriverId(vehicle._id, createUser._id);
        }
        await addNewVehicle(createUser._id, vehicle._id);
      }
    } else {
      console.log("not array");
    }
    return findById(createUser._id);
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(
        error.statusCode,
        error.message,
        error.type,
        error.code
      );
    else if (error.message.includes("E11000 duplicate key")) {
      throw new ApiError(
        error.statusCode,
        "Trùng SĐT hoặc gmail",
        "Email_1",
        "Email_1"
      );
    } else
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message,
        "Email_1",
        "Email_1"
      );
  }
};

const createUserM = async (data) => {
  try {
    const hashed = await hashPassword(data.account.password);
    data.account.password = hashed;
    data.account.role = "Manager";
    const createUser = await Person.create(data);
    if (createUser.acknowledge == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Can't create user",
        "Not create",
        "BR_person_2"
      );
    }
    return createUser;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(
        error.statusCode,
        error.message,
        error.type,
        error.code
      );
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const findByUserName = async (username) => {
  try {
    const findUser = await Person.findOne({
      "account.username": username,
    });
    return findUser;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const findById = async (_id) => {
  try {
    const user = await Person.findById(_id);
    if (user == null) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "User not found",
        "Not found",
        "BR_person_1"
      );
    }
    return user;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(
        error.statusCode,
        error.message,
        error.type,
        error.code
      );
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const findDriverByFilter = async ({ pageSize, pageIndex, ...params }) => {
  // Khởi tạo đối tượng filter
  let filter = {};
  for (let [key, value] of Object.entries(params)) {
    if (key === "licensePlate") {
      filter["driver.vehicleIds.licensePlate"] = {
        $regex: new RegExp(value, "i"),
      };
    } else if (key === "name") {
      // Tìm kiếm không phân biệt chữ hoa chữ thường cho 'name'
      filter[key] = new RegExp(`${value}`, "i");
    } else {
      // Tìm kiếm không phân biệt chữ hoa chữ thường cho các trường khác
      filter[key] = new RegExp(`^${value}`, "i");
    }
  }

  console.log(filter);

  try {
    // Cài đặt phân trang và sắp xếp mặc định
    pageSize = Number(pageSize) || 10;
    pageIndex = Number(pageIndex) || 1;

    const skip = (pageIndex - 1) * pageSize;

    // Thực hiện truy vấn với các filters, field selection, pagination, và sorting
    const drivers = await Person.find(
      { driver: { $exists: true }, ...filter }, // Truy vấn filter
      {
        _id: 1,
        name: 1,
        email: 1,
        phone: 1,
        address: 1,
        driver: 1, // Chọn trường driver
        createdAt: 1,
      }
    )
      .limit(pageSize)
      .skip(skip)
      .populate("driver.vehicleIds")
      .sort({ createdAt: -1 }); // Sắp xếp theo createdAt giảm dần

    // Đếm tổng số tài liệu phù hợp với filter
    const totalCount = await Person.countDocuments({
      driver: { $exists: true },
      ...filter,
    });
    const totalPage = Math.ceil(totalCount / pageSize);

    return {
      data: drivers,
      totalCount,
      totalPage,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const updateUser = async (_id, data) => {
  data.updateAt = Date.now();
  try {
    const updateOperation = {
      $set: {
        ...data,
      },
    };
    const update = await Person.findOneAndUpdate(
      { _id: _id },
      updateOperation,
      { new: true }
    );
    if (update == null) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "User not found",
        "Not found",
        "BR_person_1"
      );
    }
    return update;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(
        error.statusCode,
        error.message,
        error.type,
        error.code
      );
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const updateAvatar = async (_id, image) => {
  try {
    const updateOperation = {
      $set: {
        avatar: image,
        updatedAt: Date.now(),
      },
    };
    const update = await Person.findOneAndUpdate(
      { _id: _id },
      updateOperation,
      { new: true }
    );
    if (update == null) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "User not found",
        "Not found",
        "BR_person_1"
      );
    }
    return update;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(
        error.statusCode,
        error.message,
        error.type,
        error.code
      );
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const updateDriver = async (_id, data, licensePlate, job, deparment) => {
  console.log('sau khi truyen: ' + _id);
  const driver = await Person.findOne({ _id: _id });
  if (!driver) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Driver not found",
      "Not found",
      "BR_person_1"
    );
  }
  let vehicleId = driver.vehicleIds[0].vehicleId;
  const vehicle = await Vehicle.findOne({ licensePlate: licensePlate });

  if (!vehicle) {
    const newVehicle = await Vehicle.create({
      licensePlate: licensePlate,
      driverId: driver._id,
    });
    vehicleId = newVehicle.insertedId;
    await addNewVehicle(driver._id, vehicleId);
  } else if (!vehicle.driverId) {
    await addNewVehicle(driver._id, vehicle._id);
    vehicleId = vehicle._id;
  } else if (!vehicle.driverId.equals(driver._id)) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "Vehicle already assigned to another driver",
      "Conflict",
      "BR_vehicle_1"
    );
  } else {
    vehicleId = vehicle._id.toString();
  }

  data = {
    ...data,
    driver: { job: job, deparment: deparment },
  };

  try {
    const updateOperation = {
      $set: {
        ...data,
      },
    };
    const result = await Person.findOneAndUpdate(
      { _id: _id },
      updateOperation,
      { returnDocuments: true }
    );
    return result;
  } catch (err) {
    if (err.type && err.code)
      throw new ApiError(err.statusCode, err.message, err.type, err.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
  }
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const addNewVehicle = async (personId, vehicleId) => {
  try {
    const person = await Person.findById(personId);
    if (!person) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Person not found",
        "Not found",
        "BR_person_1"
      );
    }

    person.driver.vehicleIds.push(vehicleId);
    person.save();
    return person;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteUser = async (_id, role) => {
  try {
    const result = await Person.deleteOne({ _id: _id, "account.role": role });
    if (result == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Delete user failed",
        "Not Deleted",
        "BR_person_4"
      );
    }
    return result;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(
        error.statusCode,
        error.message,
        error.type,
        error.code
      );
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteAll = async () => {
  try {
    const result = await Person.deleteMany({
      account: { $exists: true },
      "account.username": { $ne: "admin" },
    });
    if (result == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Delete all users failed",
        "Not Deleted",
        "BR_person_4"
      );
    }
    return result;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(
        error.statusCode,
        error.message,
        error.type,
        error.code
      );
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteDriver = async (driverId) => {
  try {
    const driver = await Person.findOne({
      _id: driverId,
      // driver: { $exists: true },
    });
    if (driver) {
      if (driver.driver.vehicleIds.length > 0) {
        await Vehicle.deleteMany({ driverId });
      }
    } else {
      throw new ApiError("Driver not exist");
    }
    const result = await Person.deleteOne({ _id: driverId });
    return result;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const personService = {
  createUser,
  createUserM,
  findById,
  updateUser,
  updateAvatar,
  updateDriver,
  deleteUser,
  deleteAll,
  addNewVehicle,
  findByUserName,
  deleteDriver,
  findDriverByFilter,
};

export default personService;
