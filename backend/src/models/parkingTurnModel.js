import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';
import { VEHICLE_COLLECTION_NAME } from './vehicleModel.js';
import { PARKING_COLLECTION_NAME, PARKING_TURN_COLLECTION_NAME } from '../constant/index.js';

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
    ref: PARKING_COLLECTION_NAME,
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
    default: Date.now,
  },
  end: {
    type: Date,
    default: null,
  }
}, {
  timestamps: true
});

parkingTurnSchema.plugin(mongoose_delete, { 
    deletedAt: true,
    overrideMethods: 'all',
});

const ParkingTurn = mongoose.model(PARKING_TURN_COLLECTION_NAME, parkingTurnSchema);

export default ParkingTurn;