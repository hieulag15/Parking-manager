import mongoose from 'mongoose';
import { VEHICLE_COLLECTION_NAME } from './vehicleModel.js';
import { PARKING_COLLECTION_NAME } from './parkingModel.js';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const parkingTurnSchema = new Schema({
  vehicleId: {
    type: ObjectId,
    required: true,
    ref: VEHICLE_COLLECTION_NAME,
  },
  parkingId: {
    type: ObjectId,
    required: true,
    ref: PARKING_COLLECTION_NAME // Tên của collection mà ObjectId tham chiếu đến
  },
  position: {
    type: String,
    maxlength: 6,
    trim: true,
  },
  image: {
    type: String,
  },
  fee: {
    type: Number,
    required: true,
    min: 1000,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  },
  start: {
    type: Date,
    default: null,
  },
  end: {
    type: Date,
    default: null,
  }
}, {
  timestamps: true
});

parkingSchema.plugin(mongoose_delete, { 
    deletedAt: true,
    overrideMethods: 'all',
});

const ParkingTurn = mongoose.model('ParkingTurn', parkingTurnSchema);

export default ParkingTurn;