import { StatusCodes } from "http-status-codes";
import { personService } from "../services/personService.js";

const login = async (req, res) => {
    try {
        const loginUser = await personService.login(req, res);
        res.status(StatusCodes.OK).json(loginUser);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Error logging in: ${error.message}` });
    }
}

const refreshToken = async (req, res, next) => {
    try {
      // Dieu huong sang tang Service
      const refreshToken = await personService.refreshToken(req, res)
  
      res.status(StatusCodes.OK).json(refreshToken)
    } catch (error) {
      next(error)
    }
  }
  
  const checkToken = async (req, res, next) => {
    try {
      // Dieu huong sang tang Service
      const refreshToken = await personService.checkToken(req, res)
      // console('refreshToken')
      res.status(StatusCodes.OK).json(refreshToken)
    } catch (error) {
      next(error)
    }
  }

export const authController = {
    login,
    refreshToken,
    checkToken
};