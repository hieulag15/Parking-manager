import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import { paymentModel } from './paymentModel';

const VEHICLE_COLLECTION_NAME = 'vehicles';

const vehicleSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null,
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    default: null,
  },
  licenePlate: {
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{2}[A-Z]-[0-9]{4,5}$/,
  },
  type: {
    type: String,
    trim: true,
    default: 'Car',
    minlength: 2,
    maxlength: 20,
  },
  active: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  _destroy: {
    type: Boolean,
    default: false,
  },
});

const Vehicle = mongoose.model(VEHICLE_COLLECTION_NAME, vehicleSchema);


export const vehicleModel = {
  VEHICLE_COLLECTION_NAME,
  createNew,
  findOneByLicenePlate,
  deleteOne,
  updateDriverId,
  isActive,
  inActive,
  inActiveById,
};
