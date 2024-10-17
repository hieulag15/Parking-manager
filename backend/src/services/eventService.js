import Event from '../models/eventModel.js';

const create = async (eventData) => {
    try {
      const event = await Event.create(eventData);
      return event;
    } catch (error) {
      throw new Error(`Error creating event: ${error.message}`);
    }
};

const getEvents = async () => {
    try {
        const events = await Event.find();
        return events;
    } catch (error) {
        throw new Error(`Error getting events: ${error.message}`);
    }
};

export const eventService = {
    create
};