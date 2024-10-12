import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '../utils/validators.js';

export const PARKING_COLLECTION_NAME = 'parking';

const { Schema } = mongoose;

const slotSchema = new Schema({
  position: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 6,
    trim: true,
  },
  parkingTurnId: {
    type: String,
    match: [OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE],
    default: null,
  },
  isBlank: {
    type: Boolean,
    default: true,
  },
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
  rotate: {
    type: Number,
  },
  x: {
    type: Number,
  },
  y: {
    type: Number,
  },
});

const parkingSchema = new Schema({
  zone: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 2,
    trim: true,
  },
  description: {
    type: String,
    maxlength: 100,
    trim: true,
  },
  total: {
    type: Number,
    default: 0,
  },
  occupied: {
    type: Number,
    default: 0,
  },
  slots: {
    type: [slotSchema],
    validate: {
      validator: function (v) {
        return v.length >= 1 && new Set(v.map(slot => slot.position)).size === v.length;
      },
      message: "Chỗ đỗ xe phải có ít nhất là một và các vị trí phải là duy nhất.",
    },
  },
}, { timestamps: true });

parkingSchema.plugin(mongoose_delete, { 
  deletedAt: true,
  overrideMethods: 'all',
});

const Parking = mongoose.model(PARKING_COLLECTION_NAME, parkingSchema);

export const createParking = async (parkingData) => {
    try {
      const parking = await Parking.create(parkingData);
      return parking;
    } catch (error) {
      throw new Error(`Error creating parking: ${error.message}`);
    }
};

export const getAllParking = async () => {
    try {
        const parking = await Parking.find();
        return parking;
    } catch (error) {
        throw new Error(`Error getting parking: ${error.message}`);
    }
} 

export const getParkingByZone = async (zone) => {
    try {
        const parking = await Parking.findOne({ zone });
        return parking;
    } catch (error) {
        throw new Error(`Error getting parking: ${error.message}`);
    }
}

export default Parking;