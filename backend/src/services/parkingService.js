import ParkingTurn from '../models/parkingTurnModel.js';
import ApiError from '../utils/ApiError.js';
import Vehicle from '../models/vehicleModel.js';
import Person from '../models/personModel.js';
import Parking from '../models/parkingModel.js';
import { StatusCodes } from 'http-status-codes';

export const createParking = async (parkingData) => {
    try {
      const parking = await Parking.create(parkingData);
      return parking;
    } catch (error) {
      throw new Error(`Error creating parking: ${error.message}`);
    }
};

export const getParkingByZone = async (zone) => {
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
        throw new Error('Parking not found');
      }

      // thay parkingTurnId bằng parkingTurn
      const parkingWithPopulatedSlots = parking.toObject();
        parkingWithPopulatedSlots.slots = parkingWithPopulatedSlots.slots.map(slot => {
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

        return parkingWithPopulatedSlots;
    } catch (error) {
        throw new Error(`Error getting parking: ${error.message}`);
    }
}

export const updateSlot = async (parkingId, position, parkingTurnId) => {
    try {
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
          throw new ApiError(StatusCodes.NOT_FOUND, 'Parking slot not found', 'NotFound');
        }
    
        return parking;
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Error updating parking slot',
        'InternalServerError'
      );
    }
  }

export const isSlotBlank = async (parkingId, position) => {
  try {
    const parking = await Parking.findOne(
      { _id: parkingId, 'slots.position': position },
      { 'slots.$': 1 }
    );

    if (!parking) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Parking slot not found', 'NotFound');
    }

    return parking.slots[0].isBlank;
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Error checking parking slot',
      'InternalServerError'
    );
  }
}