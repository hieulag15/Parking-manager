import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import mongoose_delete from "mongoose-delete";

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
      arrayvehicleId: [
        { type: mongoose.Schema.Types.ObjectId, required: true },
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

const Person = mongoose.model("Person", personSchema);

const createNew = async (data) => {
  try {
    const check = await Person.findOne({ account: data.account });
    if (check) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Account already exists",
        "Not found"
      );
    }
    const createNew = await Person.create(data);
    return createNew;
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

const createMany = async (data) => {
  try {
    const createNew = await Person.insertMany(data, { ordered: true });
    return createNew;
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

const findByUserName = async (data) => {
  try {
    const findUser = await Person.findOne({
      "account.username": data.username,
    });
    return findUser;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const findById = async (id) => {
  try {
    const findById = await Person.findOne({ _id: id });
    return findById;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const updateUser = async (_id, data) => {
  delete data._id;
  delete data.driver;

  delete data.cratedAt;
  data.updateAt = Date.now();
  try {
    const updateOperation = {
      $set: {
        ...data,
      },
    };
    const update = await Person.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      updateOperation,
      { new: true }
    );
    return update;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(
        error.statusCode,
        error.message,
        error.type,
        error.code
      );
    else if (
      error.message.includes("Plan executor error during findAndModify")
    ) {
      throw new ApiError(
        error.statusCode,
        "Trùng SDT hoặc gmail",
        "Email_1",
        "Email_1"
      );
    } else {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
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
      { _id: new ObjectId(_id) },
      updateOperation,
      { new: true }
    );
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

const deleteUser = async (_id, role) => {
  try {
    const result = await Person.deleteOne({ _id: _id, "account.role": role });
    return result;
  } catch (err) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
  }
};

const deleteAll = async () => {
  try {
    const result = await Person.deleteMany({
      account: { $exists: true },
      "account.username": { $ne: "admin" },
    });
    return result;
  } catch (err) {
    if (err.type && err.code)
      throw new ApiError(err.statusCode, err.message, err.type, err.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const personModel = {
  Person,
  createNew,
  createMany,
  findByUserName,
  findById,
  updateUser,
  updateAvatar,
  deleteUser,
  deleteAll,
};
