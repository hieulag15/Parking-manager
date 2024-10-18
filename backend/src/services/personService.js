import { StatusCodes } from "http-status-codes";
import Person from "../models/personModel.js";
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { env } from "../config/enviroment.js";
import vehicleService from "./vehicleService.js";
import Vehicle from "../models/vehicleModel.js";

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      username: user.account.username,
      role: user.account.role,
    },
    env.JWT_ACCESS_KEY,
    { expiresIn: "2h" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      username: user.account.username,
      role: user.account.role,
    },
    env.JWT_REFRESH_KEY,
    { expiresIn: "2d" }
  );
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookie.refreshToken;
    if (!refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authenticated");
    }
    //

    jwt.verify(refreshToken, env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "You are not authenticated"
        );
      }
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        path: "/",
        sercure: false,
        sametime: "strict",
      });
      return newAccessToken;
    });
  } catch (error) {
    throw error;
  }
};

const checkToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Bạn chưa được xác thực",
        "auth",
        "BR_auth"
      );
    }

    const accessToken = token.split(" ")[1];
    const user = await new Promise((resolve, reject) => {
      jwt.verify(accessToken, env.JWT_ACCESS_KEY, (err, decoded) => {
        if (err) {
          return reject(
            new ApiError(
              StatusCodes.UNAUTHORIZED,
              "Token không hợp lệ",
              "auth",
              "BR_auth"
            )
          );
        }
        resolve(decoded);
      });
    });

    req.user = {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      iat: user.iat,
      exp: user.exp,
    };
    next();
  } catch (error) {
    next(error);
  }
};

const login = async (req, res) => {
  try {
    const data = req.body;
    const user = await Person.findOne({ "account.username": data.username });
    if (!user) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "User not found",
        "Invalid",
        "BR_person_1"
      );
    }
    const isMatch = await bcrypt.compare(
      req.body.password,
      user.account.password
    );
    if (!isMatch) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Password mismatch",
        "Invalid",
        "BR_person_1"
      );
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const userObject = user.toObject();
    delete userObject.account.password;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      sercure: false,
      sametime: "strict",
    });

    return { person: userObject, accessToken };
  } catch (e) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      e.message,
      "Internal",
      "BR_person_3"
    );
  }
};

const changePassword = async (req, res) => {
  try {
    const data = req.body;
    const user = await Person.findOne(data);
    if (!user) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "User not found",
        "Invalid",
        "BR_person_1"
      );
    }

    const validatePasswords = await bcrypt.compare(
      data.password,
      user.account.password
    );
    if (!validatePasswords) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Password mismatch",
        "Invalid",
        "BR_person_1"
      );
    }

    const newPassword = hashPassword(data.newPassword);
    user.account.password = newPassword;
    const updatePassword = await Person.updateOne(user._id, user);
    return updatePassword;
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

const createUser = async (data) => {
  try {
    const check = await Person.findOne({ account: data.account });
    if (check) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Account already exists",
        "Not found"
      );
    }

    const hashed = await hashPassword(data.account.password);
    data.account.password = hashed;
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
    if (data.driver && Array.isArray(data.driver.vehicles)) {
      for (const vehicleData of data.driver.vehicles) {
        const vehicle = await vehicleService.findByLicensePlate(
          vehicleData.licensePlate
        );
        if (!vehicle) {
          const newVehicle = await vehicleService.createNew({
            driverId: createUser._id,
            ...vehicleData,
          });
          await addNewVehicle(createUser._id, newVehicle._id);
        } else {
          await addNewVehicle(createUser._id, vehicle._id);
        }
      }
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
    if (key === "name") {
      // Tìm kiếm không phân biệt chữ hoa chữ thường cho 'name'
      filter[key] = new RegExp(`${value}`, "i"); // Đã sửa: thêm dấu `` để bao quanh ${value}
    } else {
      // Tìm kiếm không phân biệt chữ hoa chữ thường cho các trường khác
      filter[key] = new RegExp(`^${value}`, "i"); // Đã sửa: thêm dấu `` để bao quanh ${value}
    }
  }

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
  deleteUser,
  deleteAll,
  login,
  generateAccessToken,
  generateRefreshToken,
  refreshToken,
  changePassword,
  checkToken,
  addNewVehicle,
  findByUserName,
  deleteDriver,
  findDriverByFilter,
};

export default personService;
