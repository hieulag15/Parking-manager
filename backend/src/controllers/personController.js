import { StatusCodes } from "http-status-codes";
import { personService } from "../services/personService.js";

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

const createManager = async (req, res) => {
  try {
    const createManager = await personService.createManager(req.body);
    res.status(StatusCodes.CREATED).json(createManager);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: `Error creating manager: ${error.message}` });
  }
};

const createMany = async (req, res) => {
  try {
    const createMany = await personService.createMany(req.body);
    res.status(StatusCodes.CREATED).json(createMany);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: `Error creating many: ${error.message}` });
  }
};

const findById = async (req, res) => {
  try {
    const { _id } = req.query;
    const users = await personService.findById(_id);
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: `Error getting user: ${error.message}` });
  }
};

const updateUser = async (req, res) => {
  try {
    const newUser = req.body;
    delete newUser.account;
    const result = await personService.updateUser(req.query._id, newUser);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: `Error updating user: ${error.message}` });
  }
};

const deleteUser = async (req, res) => {
    try {
        const result = await personService.deleteUser(req.query._id, 'Admin');
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        res
           .status(StatusCodes.INTERNAL_SERVER_ERROR)
           .json({ message: `Error deleting user: ${error.message}` });
    }
}

const deleteManager = async (req, res) => {
    try {
        const result = await personService.deleteUser(req.query._id, 'Manager');
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        res
           .status(StatusCodes.INTERNAL_SERVER_ERROR)
           .json({ message: `Error deleting manager: ${error.message}` });
    }
}

const deleteStaff = async (req, res) => {
    try {
        const result = await personService.deleteUser(req.query._id, 'Staff');
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        res
           .status(StatusCodes.INTERNAL_SERVER_ERROR)
           .json({ message: `Error deleting staff: ${error.message}` });
    }
}

const deleteStaffs = async (req, res) => {
    try {
        const ids = req.body.ids;
        const result = await personService.deleteMany(ids, 'Manager');
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        res
           .status(StatusCodes.INTERNAL_SERVER_ERROR)
           .json({ message: `Error deleting many staffs: ${error.message}` });
    }
}

const deleteMnagers = async (req, res) => {
    try {
        const ids = req.body.ids;
        const result = await personService.deleteMany(ids, 'Admin');
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        res
           .status(StatusCodes.INTERNAL_SERVER_ERROR)
           .json({ message: `Error deleting many managers: ${error.message}` });
    }
}

const deleteAll = async (req, res) => {
    try {
        const result = await personService.deleteAll();
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        res
           .status(StatusCodes.INTERNAL_SERVER_ERROR)
           .json({ message: `Error deleting all: ${error.message}` });
    }
}

export const personController = {
    createNew,
    createManager,
    createMany,
    findById,
    updateUser,
    deleteUser,
    deleteManager,
    deleteStaff,
    deleteStaffs,
    deleteMnagers,
    deleteAll,
}