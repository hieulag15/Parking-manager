import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';
import { PERSON_COLLECTION_NAME, VEHICLE_COLLECTION_NAME } from '../constant/index.js';

const { Schema } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

export const vehicleSchema = new Schema({
  driverId: {
    type: ObjectId,
    ref: PERSON_COLLECTION_NAME,
    default: null,
  },
  licensePlate: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[0-9]{2}[A-Z]-[0-9]{4,5}$/,
  },
  type: {
    type: String,
    minlength: 2,
    maxlength: 20,
    trim: true,
    default: 'Car',
  },
  isParked: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

vehicleSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: 'all',
});

const Vehicle = mongoose.model(VEHICLE_COLLECTION_NAME, vehicleSchema);

export default Vehicle;