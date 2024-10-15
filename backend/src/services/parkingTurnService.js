import { updateSlot, isSlotBlank } from '../services/parkingService.js';
import ParkingTurn from '../models/parkingTurnModel.js';
import Vehicle from '../models/vehicleModel.js';
import Parking from '../models/parkingModel.js';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';

export const createParkingTurn = async (data) => {
    try {
        const vehicleExists = await Vehicle.exists({ _id: data.vehicleId });
        const parkingExists = await Parking.exists({ _id: data.parkingId }); //zone là parkingId của collection parking

        if (!vehicleExists) {
            throw new  ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Không có thông tin về xe này', 'Not Created', 'BR_parking_3');
        }

        // // Kiểm tra xe có trong bãi chưa
        const vehicleInParking = await findVehicleInParkingTurn(data.vehicleId);

        if (vehicleInParking) {
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Xe đã ở trong bãi');
        }

        if (!parkingExists) {
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Không có thông tin về bãi đỗ này', 'Not Created', 'BR_parking_3');
        }

        // Kiểm tra slot có trống không
        const slotBlank = await isSlotBlank(data.parkingId, data.position);

        if (!slotBlank) {
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Chỗ đỗ xe đã được sử dụng', 'Not Created', 'BR_parking_3');
        }

        // Tạo tài liệu parkingTurn mới
        const newParkingTurn = await ParkingTurn.create(data);

        // // Cập nhật slot của parking
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
        throw new Error(error.message);
    }
}

// Đối với xe máy không cần position
export const createParkingTurnWithoutPosition = async (data) => {
    try {
        const vehicleExists = await Vehicle.exists({ _id: data.vehicleId });
        const parkingExists = await Parking.exists({ _id: data.parkingId });

        if (!vehicleExists) {
            throw new  ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Không có thông tin về xe này', 'Not Created', 'BR_parking_3');
        }

        // // Kiểm tra xe có trong bãi chưa
        const vehicleInParking = await findVehicleInParkingTurn(data.vehicleId);

        if (vehicleInParking) {
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Xe đã ở trong bãi');
        }

        if (!parkingExists) {
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Không có thông tin về bãi đỗ này', 'Not Created', 'BR_parking_3');
        }

        // Tạo tài liệu parkingTurn mới
        const newParkingTurn = await ParkingTurn.create(data);

        return newParkingTurn;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const findVehicleInParkingTurn = async (vehicleId) => {
    try {
        const vehicleInParking = await ParkingTurn.findOne({ vehicleId }); // thì xe có trong bãi
        return vehicleInParking;
    } catch (error) {
        // throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Tìm kiếm xe trong bãi thất bại', 'Not Created', 'BR_parking_3');
        console.log('Tìm kiếm xe trong bãi thất bại');
    }
}