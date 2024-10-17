import { PERSON_COLLECTION_NAME, EVENT_COLLECTION_NAME, PARKING_COLLECTION_NAME, VEHICLE_COLLECTION_NAME } from '../constant/index.js';
import mongoose_delete from 'mongoose-delete';
import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

// Định nghĩa schema
const eventSchema = new Schema({
  name: {
    type: String,
    required: true,
    enum: ['in', 'out'],
    trim: true,
  },
  zone: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 2,
    trim: true,
  },
  parkingId: {
    type: ObjectId,
    required: true,
    ref: PARKING_COLLECTION_NAME,
  },
  position: {
    type: String,
    maxlength: 6,
    trim: true,
  },
  vehicleId: {
    type: ObjectId,
    required: true,
    ref: VEHICLE_COLLECTION_NAME,
  },
  licensePlate: {
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{2}[A-Z]-[0-9]{4,5}$/,
  },
  driverId: {
    type: ObjectId,
    ref: PERSON_COLLECTION_NAME,
    default: null,
  },
  driverName: {
    type: String,
    trim: true,
    default: null,
  }
}, {
    timestamps: true
});

eventSchema.plugin(mongoose_delete, { 
    deletedAt: true,
    overrideMethods: 'all',
});

// Tạo model
const Event = mongoose.model(EVENT_COLLECTION_NAME, eventSchema);

export default Event;