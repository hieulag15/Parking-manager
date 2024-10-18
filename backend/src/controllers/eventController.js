import eventService from "../services/eventService.js";
import { StatusCodes } from "http-status-codes";

const getEvent = async (req, res, next) => {
  try {
    const filter = req.query
    const getEvens = await eventService.findEvent(filter);
    res.status(StatusCodes.OK).json(getEvens);
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req, res, next) => {
    try {
        const newEvent = await eventService.create(req.body);
        res.status(StatusCodes.CREATED).json(newEvent);
    } catch (error) {
        next(error);
    }
    }

const eventController = {
    getEvent,
    createEvent
};

export default eventController;