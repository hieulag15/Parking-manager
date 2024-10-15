import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import mongoose_delete from "mongoose-delete";
import Vehicle from "./vehicleModel.js";
import { vehicleService } from "../services/vehicleService.js";
import { PERSON_COLLECTION_NAME, VEHICLE_COLLECTION_NAME } from '../constant/index.js';

const ObjectId = mongoose.Types.ObjectId;

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
      vehicleIds: [
        { 
          type: mongoose.Schema.Types.ObjectId,
          ref: VEHICLE_COLLECTION_NAME,
          required: true 
        },
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

const Person = mongoose.model(PERSON_COLLECTION_NAME, personSchema);

export default Person;
