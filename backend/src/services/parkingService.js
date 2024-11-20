import ParkingTurn from '../models/parkingTurnModel.js';
import ApiError from '../utils/ApiError.js';
import Vehicle from '../models/vehicleModel.js';
import Person from '../models/personModel.js';
import Parking from '../models/parkingModel.js';
import { StatusCodes } from 'http-status-codes';

const create = async (parkingData, next) => {
    try {
      const parking = await Parking.create(parkingData);
      return parking;
    } catch (error) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `${error.message}`));
    }
};

const getParkingByZone = async (zone, next) => {
    try {
      const parking = await Parking.findOne({ zone }).populate({
        path: 'slots.parkingTurnId',
        model: ParkingTurn,
        populate: {
          path: 'vehicleId',
          model: Vehicle,
          populate: {
            path: 'driverId',
            model: Person,
          }
        }
      });

      if (!parking) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'Parking not found'));
      }

      // thay parkingTurnId bằng parkingTurn
      const parkingWithPopulatedSlots = parking.toObject();
        parkingWithPopulatedSlots.slots = parkingWithPopulatedSlots.slots
        .filter(slot => !slot.isBlank)
        .map(slot => {
            if (slot.parkingTurnId) {
                slot.parkingTurn = slot.parkingTurnId;
                delete slot.parkingTurnId;

                if (slot.parkingTurn.vehicleId) {
                  slot.parkingTurn.vehicle = slot.parkingTurn.vehicleId;
                  delete slot.parkingTurn.vehicleId;

                  if (slot.parkingTurn.vehicle.driverId) {
                    slot.parkingTurn.vehicle.driver = slot.parkingTurn.vehicle.driverId;
                    delete slot.parkingTurn.vehicle.driverId;
                  }
                }
            }
            return slot;
        });

        // Tính toán số lượng chỗ đậu xe không có người chiếm dụng
        const totalSlots = parkingWithPopulatedSlots.slots.length;
        const occupiedSlots = parkingWithPopulatedSlots.slots.filter(slot => slot.parkingTurn).length;
        const unoccupiedSlots = totalSlots - occupiedSlots;

        // Bổ sung trường unoccupied
        parkingWithPopulatedSlots.unoccupied = unoccupiedSlots;

        return parkingWithPopulatedSlots;
    } catch (error) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `${error.message}`));
    }
}

const updateSlot = async (parkingId, position, parkingTurnId = null, next) => {
    try {
        if (parkingTurnId) {
          const parking = await Parking.findOneAndUpdate(
            { _id: parkingId, 'slots.position': position },
            {
              $set: {
                'slots.$.parkingTurnId': parkingTurnId,
                'slots.$.isBlank': false,
              },
              $inc: { occupied: 1 },
            },
            { new: true }
          )
  
          if (!parking) {
            return next(new ApiError(StatusCodes.NOT_FOUND, 'Parking slot not found'));
          }
      
          return parking;
        } else {
          const parking = await Parking.findOneAndUpdate(
            { _id: parkingId, 'slots.position': position },
            {
              $set: {
                'slots.$.isBlank': true,
              },
              $inc: { occupied: -1 },
            },
            { new: true }
          )
  
          if (!parking) {
            return next(new ApiError(StatusCodes.NOT_FOUND, 'Parking slot not found'));
          }
      
          return parking;
        }
    } catch (error) {
      return next(new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Error updating parking slot',
      ));
    }
  }

const isSlotBlank = async (parkingId, position, next) => {
  try {
    const parking = await Parking.findOne(
      { _id: parkingId, 'slots.position': position },
      { 'slots.$': 1 }
    );

    if (!parking) {
      return next(new ApiError(StatusCodes.NOT_FOUND, 'Parking slot not found'));
    }

    return parking.slots[0].isBlank;
  } catch (error) {
    throw error
  }
}

const findEnptySlot = async (parkingId, next) => {
  try {
    const parking = await Parking.findById(parkingId);
    if (!parking) {
      return next(new ApiError(StatusCodes.NOT_FOUND, 'Parking not found'));
    }

    const emptySlot = parking.slots.find(slot => slot.isBlank);
    if (!emptySlot) {
      return next(new ApiError(StatusCodes.NOT_FOUND, 'No empty slot found'));
    }
    console.log("test: ", emptySlot.position);
    return emptySlot.position;
  } catch (error) {
    return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `${error.message}`));
  }
}

const parkingService = {
    create,
    getParkingByZone,
    updateSlot,
    isSlotBlank,
    findEnptySlot,
};

export default parkingService;