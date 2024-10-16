import { VEHICLE_COLLECTION_NAME, PARKING_COLLECTION_NAME, EVENT_COLLECTION_NAME } from '../constant/index.js';
import mongoose_delete from 'mongoose-delete';
import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

// Định nghĩa schema
const eventSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['in', 'out'],
    trim: true,
  },
  vehicleId: {
    type: ObjectId,
    required: true,
    ref: VEHICLE_COLLECTION_NAME,
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