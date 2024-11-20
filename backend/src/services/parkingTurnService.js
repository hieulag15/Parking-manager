import parkingService from '../services/parkingService.js';
import ParkingTurn from '../models/parkingTurnModel.js';
import Vehicle from '../models/vehicleModel.js';
import Parking from '../models/parkingModel.js';
import ApiError from '../utils/ApiError.js';
import eventService from './eventService.js';
import vehicleService from './vehicleService.js';
import { StatusCodes } from 'http-status-codes';

const create = async (data, next) => {
  try {
    let vehicle = await Vehicle.findOne({ licensePlate: data.licensePlate }).populate('driverId');
    const parking = await Parking.findOne({ zone: data.zone });

    if (!vehicle) {
      // Tạo thông tin xe mới
      vehicle = await vehicleService.create(data);
    }

    // Kiểm tra xe có trong bãi chưa
    const vehicleInParking = await findVehicleInParkingTurn(data.licensePlate);

    if (vehicleInParking) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Xe đã ở trong bãi'));
    }

    if (!parking) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Không có thông tin về bãi đỗ này', 'Not Created', 'BR_parking_3'));
    }

    // Kiểm tra slot có trống không
    const slotBlank = await parkingService.isSlotBlank(parking._id, data.position, next);

    if (!slotBlank) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Chỗ đỗ xe đã được sử dụng', 'Not Created', 'BR_parking_3'));
    }

    // Tạo tài liệu parkingTurn mới
    const newParkingTurn = await ParkingTurn.create({
      vehicleId: vehicle._id,
      parkingId: parking._id,
      position: data.position,
      fee: data.fee
    });

    // Cập nhật slot của parking
    await parkingService.updateSlot(parking._id, data.position, newParkingTurn._id, next)
      .then(updatedParking => {
        console.log('Parking slot updated:', updatedParking);
      })
      .catch(error => {
        console.error('Error updating parking slot:', error);
        return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Bãi cập nhật không thành công', 'Not Updated', 'BR_parking_3'));
      });

    // Tạo sự kiện vào bãi
    await eventService.create({
      name: 'in',
      zone: parking.zone,
      parkingTurnId: newParkingTurn._id,
      position: data.position,
      vehicleId: vehicle._id,
      licensePlate: vehicle.licensePlate,
      driverId: vehicle?.driverId?._id || null,
      driverName: vehicle?.driverId?.name || 'Khách vãng lai',
    });

    // Cập nhật trạng thái xe
    await vehicleService.updateIsParked(vehicle._id, true);

    return newParkingTurn;
  } catch (error) {
    return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};

// Đối với xe máy không cần position
const createWithoutPosition = async (data, next) => {
  try {
    const vehicle = await Vehicle.findOne({ licensePlate: data.licensePlate });
    const parking = await Parking.findOne({ zone: data.zone });

    if (!vehicle) {
      // Tạo thông tin xe mới
      vehicle = await vehicleService.create(data);
    }

    // Kiểm tra xe có trong bãi chưa
    const vehicleInParking = await findVehicleInParkingTurn(data.licensePlate);

    if (vehicleInParking) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Xe đã ở trong bãi'));
    }

    if (!parking) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Không có thông tin về bãi đỗ này', 'Not Created', 'BR_parking_3'));
    }

    // Tạo tài liệu parkingTurn mới
    const newParkingTurn = await ParkingTurn.create({
      vehicleId: vehicle._id,
      parkingId: parking._id,
      fee: data.fee
    });

    // Tạo sự kiện vào bãi
    await eventService.create({
      name: 'in',
      zone: parking.zone,
      parkingTurnId: newParkingTurn._id,
      vehicleId: vehicle._id,
      licensePlate: vehicle.licensePlate,
      driverId: vehicle?.driverId?._id || null,
      driverName: vehicle?.driverId?.name || 'Khách vãng lai',
    });

    // Cập nhật trạng thái xe
    await vehicleService.updateIsParked(vehicle._id, true);

    return newParkingTurn;
  } catch (error) {
    return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};

const outParking = async (data, next) => {
  try {
    const parkingTurn = await findVehicleInParkingTurn(data.licensePlate);
    const parking = await Parking.findOne({ _id: parkingTurn.parkingId });
    const vehicle = await Vehicle.findOne({ licensePlate: data.licensePlate }).populate('driverId');

    if (!parkingTurn) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Xe không ở trong bãi', 'Not Found', 'BR_parking_3'));
    }

    // Cập nhật thời gian xe ra bãi
    await updateParkingTurnEndTime(vehicle._id, next);

    if (parkingTurn.position) {
      // Cập nhật slot của parking
      await parkingService.updateSlot(parkingTurn.parkingId, parkingTurn.position, null, next)
        .then(updatedParking => {
          console.log('Parking slot updated:', updatedParking);
        })
        .catch(error => {
          console.error('Error updating parking slot:', error);
          return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Bãi cập nhật không thành công', 'Not Updated', 'BR_parking_3'));
        });
    }

    // Tạo sự kiện ra bãi
    await eventService.create({
      name: 'out',
      zone: parking.zone,
      parkingTurnId: parkingTurn._id,
      position: parkingTurn.position,
      vehicleId: vehicle._id,
      licensePlate: vehicle.licensePlate,
      driverId: vehicle?.driverId?._id || null,
      driverName: vehicle?.driverId?.name || 'Khách vãng lai',
    });

    // Cập nhật trạng thái xe
    await vehicleService.updateIsParked(vehicle._id, false);

  } catch (error) {
    return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};

const updateParkingTurnEndTime = async (vehicleId, next) => {
  try {
    const latestParkingTurn = await ParkingTurn.findOne({ vehicleId: vehicleId })
      .sort({ createdAt: -1 });

    if (!latestParkingTurn) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Parking turn not found'));
    }

    const updateEndTime = await ParkingTurn.findByIdAndUpdate(
      latestParkingTurn._id,
      { end: Date.now(), status: 'out' },
      { new: true }
    );

    return updateEndTime;
  } catch (error) {
    return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error updating parking turn end time: ${error.message}`));
  }
};

const findVehicleInParkingTurn = async (licensePlate, next) => {
  const vehicle = await Vehicle.findOne({ licensePlate });
  try {
    const parkingTurn = await ParkingTurn.findOne({ vehicleId: vehicle._id, status: 'in' }); // thì xe có trong bãi
    return parkingTurn;
  } catch (error) {
    return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Tìm kiếm xe trong bãi thất bại', 'Not Created', 'BR_parking_3'));
  }
};

const parkingTurnService = {
  create,
  createWithoutPosition,
  outParking
};

export default parkingTurnService;