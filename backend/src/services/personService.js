import { StatusCodes } from "http-status-codes";
import Person, { personModel } from "../models/personModel.js";
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError.js";
import jwt from 'jsonwebtoken'
import { env } from "../config/enviroment.js";
import { vehicleService } from "./vehicleService.js";

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      username: user.account.username,
      role: user.account.role,
    },
    env.JWT_ACCESS_KEY,
    { expiresIn: '2h' },
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
    { expiresIn: '2d' },
  );
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookie.refreshToken;
    if (!refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authenticated');
    }
    //

    jwt.verify(refreshToken, env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authenticated');
      }
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        path: '/',
        sercure: false,
        sametime: 'strict',
      });
      return newAccessToken;
    });
  } catch (error) {
    throw error;
  }
};

const checkToken = async (req, res) => {
  let user1;
  try {
    const token = req.headers.authorization;
    if (token) {
      const accessToken = token.split(' ')[1];
      jwt.verify(accessToken, env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            { message: 'Token không hợp lệ' },
            { type: 'auth' },
            { code: 'BR_auth' },
          );
        }
        user1 = user;
      });
      return user1;
    } else {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        { message: 'Bạn chưa được xác thực' },
        { type: 'auth' },
        { code: 'BR_auth' },
      );
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const login = async (req, res) => {
  try {
    const data = req.body;
    const user = await Person.findOne({ 'account.username': data.username });
    if (!user) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "User not found",
        "Invalid",
        "BR_person_1"
      );
    }
    const isMatch = await bcrypt.compare(req.body.password, user.account.password);
    if (!isMatch) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Password mismatch",
        "Invalid",
        "BR_person_1"
      );
    }
    const accessToken = generateRefreshToken(user);
    const refreshToken = generateRefreshToken(user);
    
    const userObject = user.toObject();
    delete userObject.account.password;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',  
      sercure: false,
      sametime: 'strict',
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
}

const changePassword = async (req, res) => {
  try {
    const data = req.body;
    const user = await personModel.findOne(data);
    if (!user) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "User not found",
        "Invalid",
        "BR_person_1"
      );
    }

    const validatePasswords = await bcrypt.compare(data.password, user.account.password)
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
    const updatePassword = await personModel.updateUser(user._id, user);
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
}

const createUser = async (data) => {
  try {
    const hashed = await hashPassword(data.account.password);
    data.account.password = hashed;
    const createUser = await personModel.createNew(data);
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

const createUserM = async (data) => {
  try {
    const hashed = await hashPassword(data.account.password);
    data.account.password = hashed;
    data.account.role = "Manager";
    const createUser = await personModel.createNewM(data);
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

const createMany = async (_data) => {
  try {
    const data = await Promise.all(
      _data.map(async (el) => {
        const hashed = await hashPassword(el.account.password);
        el.account.password = hashed;
        return el;
      })
    );
    const createMany = await personModel.createMany(data);
    if (createMany.acknowledge == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Can't create many users",
        "Not create",
        "BR_person_2"
      );
    }
    return createMany;
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

const createDriver = async (data) => {
  try {
    let { licenePlate, job, department, ...other} = data;
    let vehicle = await vehicleService.findByLicensePlate(licenePlate);
    if (!vehicle) {
      vehicle = await vehicleService.createNew({ licenePlate: licenePlate});
      if (vehicle.acknowledge == false) {
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Can't create vehicle",
          "Not create",
          "BR_vehicle_2"
        );
      }
    }

    const createDriver = await personModel.createDriver(other, licenePlate, job, department)
    if (createDriver.acknowledge == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Can't create driver",
        "Not create",
        "BR_person_2"
      );
    }
    return createDriver;
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
} 

const findById = async (_id) => {
  try {
    const user = await personModel.findById(_id);
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

const updateUser = async (_id, params) => {
    try {
        const user = await personModel.updateUser(_id, params);
        console.log('id service: ' + _id);
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
}

const updateAvatar = async (_id, image) => {
    try {
      console.log("id service: " + _id)
        const user = await personModel.updateAvatar(_id, image);
        if (users == null) {
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
}

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const deleteUser = async (_id, role) => {
    try {
        const user = await personModel.deleteUser(_id, role);
        if (user == false) {
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                "Delete user failed",
                "Not Deleted",
                "BR_person_4"
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
}

const deleteAll = async () => {
    try {
        const users = await personModel.deleteAll();
        if (users == false) {
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                "Delete all users failed",
                "Not Deleted",
                "BR_person_4"
            );
        }
        return users;
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
}

const deleteMany = async (ids, role) => {
    try {
        const users = await personModel.deleteMany(ids, role);
        if (users == false) {
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                "Delete many users failed",
                "Not Deleted",
                "BR_person_4"
            );
        }
        return users;
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
}

export const personService = {
    createUser,
    createUserM,
    createMany,
    findById,
    updateUser,
    updateAvatar,
    deleteUser,
    deleteAll,
    deleteMany,
    login,
    generateAccessToken,
    generateRefreshToken,
    refreshToken,
    changePassword,
    checkToken,
}