import { StatusCodes } from "http-status-codes";
import personService from "../services/personService.js";

export const createNew = async (req, res) => {
  try {
    const createUser = await personService.createUser(req.body);
    res.status(StatusCodes.CREATED).json(createUser);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: `Error creating manager: ${error.message}` });
  }
};

const findByUserName = async (req, res) => {
  try {
    const users = await personService.findByUserName(req.query.username);
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: `Error getting user: ${error.message}` });
  }
}

const findById = async (req, res) => {
  try {
    const users = await personService.findById(req.query._id);
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: `Error getting user: ${error.message}` });
  }
};

const updateUser = async (req, res) => {
  try {
    const payload = req.body;
    const result = await personService.updateUser(req.query.id, payload);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: `Error updating user: ${error.message}` });
  }
};

const changePassword = async (req, res, next) => {
  try {
    const payload = req.body;
    const result = await personService.changePassword(payload, next);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Error changing password: ${error.message}` });
  }
}

const updateAvatar = async (req, res) => {
  try {
    const { id, avatar } = req.body;
    const result = await personService.updateAvatar(id, avatar);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: `Error updating avatar: ${error.message}` });
  }
}

const updateDriver = async (req, res) => {
  try {
    const payload = req.body;
    const id = req.query._id;
    const result = await personService.updateDriver(id, payload);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res
     .status(StatusCodes.INTERNAL_SERVER_ERROR)
     .json({ message: `Error updating driver: ${error.message}` });
  }
}

const deleteUser = async (req, res) => {
  try {
    const result = await personService.deleteUser(req.query._id, "user");
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: `Error deleting user: ${error.message}` });
  }
};

const deleteAll = async (req, res) => {
  try {
    const result = await personService.deleteAll();
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: `Error deleting all: ${error.message}` });
  }
};

const deleteDriver = async (req, res) => {
  try {
    const result = await personService.deleteDriver(req.query._id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: `Error deleting driver: ${error.message}` });
  }
}

const findDriverByFilter = async (req, res) => {
  try {
    const result = await personService.findDriverByFilter(req.query);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: `Error finding driver: ${error.message}` });
  }
}

const personController = {
  createNew,
  findById,
  updateUser,
  changePassword,
  updateDriver,
  deleteUser,
  deleteAll,
  deleteDriver,
  findByUserName,
  updateAvatar,
  findDriverByFilter,
};

export default personController;
