import { StatusCodes } from "http-status-codes";
import Person from "../models/personModel.js";
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { env } from "../config/enviroment.js";

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

const authentication = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Person.findOne({ 'account.username': username });
    if (!user) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "User not found",
        "Invalid",
        "BR_person_1"
      );
    }
    const isMatch = await bcrypt.compare(
      password,
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

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    return { person: user, accessToken };
  } catch (error) {
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

const reAuthentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Bạn chưa được xác thực',
        'auth',
        'BR_auth'
      );
    }

    const accessToken = token.split(' ')[1];
    const user = await new Promise((resolve, reject) => {
      jwt.verify(accessToken, env.JWT_ACCESS_KEY, (err, decoded) => {
        if (err) {
          return reject(
            new ApiError(
              StatusCodes.UNAUTHORIZED,
              'Token không hợp lệ',
              'auth',
              'BR_auth'
            )
          );
        }
        resolve(decoded);
      });
    });

    return user;
  } catch (error) {
    if (error.type && error.code) {
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    } else {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
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

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const authService = {
  generateAccessToken,
  generateRefreshToken,
  refreshToken,
  changePassword,
  authentication,
  reAuthentication,
};

export default authService;
