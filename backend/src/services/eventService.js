import Event from '../models/eventModel.js';

const create = async (eventData) => {
    try {
      const event = await Event.create(eventData);
      return event;
    } catch (error) {
      throw new Error(`Error creating event: ${error.message}`);
    }
};

const findEvent = async ({ pageSize, pageIndex, ...params }) => {
    try {
        const filter = {};
        if (params.name) filter['name'] = params.name;
        if (params.position) filter['position'] = params.position;
        if (params.licensePlate) filter['licensePlate'] = params.licensePlate;
        if (params.driverName) filter['driverName'] = params.driverName;
    
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
        throw new Error(error.message);
      }
};

const eventService = {
    create,
    findEvent
};

export default eventService;