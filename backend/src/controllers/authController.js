import { StatusCodes } from "http-status-codes";
import authService from "../services/authService.js";

const login = async (req, res) => {
  try {
      const loginUser = await authService.login(req, res);
      res.status(StatusCodes.OK).json(loginUser);
  } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Error logging in: ${error.message}` });
  }
}

const refreshToken = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const refreshToken = await authService.refreshToken(req, res)

    res.status(StatusCodes.OK).json(refreshToken)
  } catch (error) {
    next(error)
  }
}

const checkToken = async (req, res, next) => {
  try {
    // Điều hướng sang tầng Service
    await authService.checkToken(req, res, next);
    res.status(StatusCodes.OK).json(req.user);
  } catch (error) {
    next(error);
  }
};

const authentication = async (req, res, next) => {
  try {
    const loginUser = await authService.authentication(req, res);
    res.status(StatusCodes.OK).json(loginUser);
  } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Error logging in: ${error.message}` });
  }
};

const reAuthentication = async (req, res, next) => {
  // try {
  //   const auth = await authService.reAuthentication(req, res, next);
  //   res.status(StatusCodes.OK).json(auth);
  // } catch (error) {
  //   res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  // }
  try {
    // Dieu huong sang tang Service
    const refreshToken = await authService.reAuthentication(req, res)
    // console('refreshToken')
    res.status(StatusCodes.OK).json(refreshToken)
  } catch (error) {
    next(error)
  }
};

const authController = {
    login,
    refreshToken,
    checkToken,
    authentication,
    reAuthentication
};

export default authController;