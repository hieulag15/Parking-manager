import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';
import { VEHICLE_COLLECTION_NAME } from './vehicleModel.js';
import { updateSlot, isSlotBlank } from './parkingModel.js';
import { PARKING_COLLECTION_NAME, PARKING_TURN_COLLECTION_NAME } from '../constant/index.js';
import Vehicle from './vehicleModel.js';
import Parking from './parkingModel.js';
import ApiError from '../utils/ApiError.js';

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

export const createParkingTurn = async (data) => {
    try {
        const vehicleExists = await Vehicle.exists({ _id: data.vehicleId });
        const parkingExists = await Parking.exists({ _id: data.parkingId }); //zone là parkingId của collection parking

        if (!vehicleExists || !parkingExists) {
            throw new Error('Vehicle or Parking not found');
        }

        // Kiểm tra xe có trong bãi chưa
        const vehicleInParking = await findVehicleInParkingTurn(data.vehicleId);

        if (vehicleInParking) {
            throw new Error('Vehicle is already in parking turn');
        }

        // Kiểm tra slot có trống không
        const slotBlank = await isSlotBlank(data.parkingId, data.position);

        if (!slotBlank) {
            throw new Error('Chỗ đỗ xe đã được sử dụng');
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

        return newParkingTurn;
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