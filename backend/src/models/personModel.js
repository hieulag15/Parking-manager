import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import ApiError from "~/utils/ApiError";

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

const validateBeforeCreate = async (data) => {
  return await personSchema.validateAsync(data, { abortEarly: false });
};

const createNew = async (data) => {
  try {
    const validationData = await validateBeforeCreate(data);
    const check = await findOne(data.account);
    if (check) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Account already exists",
        "Not found"
      );
    }
    const createNew = await Person.insertOne(validationData);
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

export const personModel = {
  Person,
  validateBeforeCreate,
};
