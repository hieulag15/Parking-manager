import { StatusCodes } from "http-status-codes";
import { personModel } from "~/models/personModel.js";
import ApiError from "~/utils/ApiError";

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

const updateAvatar = async (_id, image) => {
    try {
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

export const userService = {
    createUser,
    createUserM,
    createMany,
    findById,
    updateUser,
    updateAvatar,
    deleteUser,
    deleteAll,
    deleteMany,
}