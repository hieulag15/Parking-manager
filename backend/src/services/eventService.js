import Event from '../models/eventModel.js';
import moment from 'moment';
import { StatusCodes } from "http-status-codes";
import ApiError from '../utils/ApiError.js';

const create = async (eventData, next) => {
    try {
      const event = await Event.create(eventData);
      return event;
    } catch (error) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `${error.message}`));
    }
};

const findEvent = async ({ pageSize, pageIndex, startDay, endDay, startTime, endTime, ...params }, next) => {
  try {
      const filter = {};
      if (params.name) filter['name'] = params.name;
      if (params.position) filter['position'] = params.position;
      if (params.licensePlate) filter['licensePlate'] = params.licensePlate;
      if (params.driverName) filter['driverName'] = params.driverName;

      if (startDay && endDay) {
        const startDateTime = moment(`${startDay} ${startTime || '00:00'}`, 'DD/MM/YYYY HH:mm').toDate();
        const endDateTime = moment(`${endDay} ${endTime || '23:59'}`, 'DD/MM/YYYY HH:mm').toDate();
        filter['createdAt'] = {
            $gte: startDateTime,
            $lte: endDateTime,
        };
      } else if (startTime && endTime) {
          const today = moment().format('DD/MM/YYYY');
          const startDateTime = moment(`${today} ${startTime}`, 'DD/MM/YYYY HH:mm').toDate();
          const endDateTime = moment(`${today} ${endTime}`, 'DD/MM/YYYY HH:mm').toDate();
          filter['createdAt'] = {
              $gte: startDateTime,
              $lte: endDateTime,
          };
      }
  
      const totalCount = await Event.countDocuments(filter);
      const totalPage = Math.ceil(totalCount / pageSize);
      const events = await Event.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageIndex - 1) * pageSize)
        .limit(pageSize)
        .populate('parkingTurnId')
        .populate('driverId')
  
      return {
        data: events,
        totalCount,
        totalPage,
      };
    } catch (error) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
    }
};

const eventService = {
    create,
    findEvent
};

export default eventService;