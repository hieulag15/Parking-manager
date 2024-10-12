import mongoose from 'mongoose';
import { VEHICLE_COLLECTION_NAME } from './vehicleModel.js';
import { PARKING_COLLECTION_NAME, updateSlot } from './parkingModel.js';
import Vehicle from './vehicleModel.js';
import Parking from './parkingModel.js';
import ApiError from '~/utils/ApiError.js';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const PARKING_TURN_COLLECTION_NAME = 'parkingTurns'

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

const ParkingTurn = mongoose.model(PARKING_TURN_COLLECTION_NAME, parkingTurnSchema);

export const createParkingTurn = async (data) => {
    try {
        const vehicleExists = await Vehicle.exists({ licenePlate: data.vehicleId });
        const parkingExists = await Parking.exists({ zone: data.parkingId }); //zone là parkingId của collection parking

        if (!vehicleExists || !parkingExists) {
            throw new Error('Vehicle or Parking not found');
        }

        // Kiểm tra xe có trong bãi chưa
        const vehicleInParking = await findVehicleInParkingTurn(data.vehicleId);

        if (vehicleInParking) {
            throw new Error('Vehicle is already in parking turn');
        }

        // Tạo tài liệu parkingTurn mới
        const newParkingTurn = await ParkingTurn.create(data);

        // Cập nhật slot của parking
        await updateSlot(data.parkingId, data.position, newParkingTurn._id)
            .then(updatedParking => {
                console.log('Parking slot updated:', updatedParking);
            })
            .catch(error => {
                console.error('Error updating parking slot:', error);
                throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Bãi cập nhật không thành công', 'Not Updated', 'BR_parking_3');
            });
    } catch (error) {
        throw new Error(`Error creating parking turn: ${error.message}`);
    }
}

export const findVehicleInParkingTurn = async (vehicleId) => {
    try {
        return await ParkingTurn.findOne({ vehicleId, end: null }); // thì xe có trong bãi
    } catch (error) {
        throw new Error(`Error finding vehicle in parking turn: ${error.message}`);
    }
}

export default ParkingTurn;