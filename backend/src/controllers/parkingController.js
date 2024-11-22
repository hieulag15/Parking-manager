import parkingService from '../services/parkingService.js';

const createParkingController = async (req, res, next) => {
  try {
    const parkingData = req.body;
    const newParking = await parkingService.create(parkingData, next);
    res.status(201).json(newParking);
  } catch (error) {
    res.status(500).json({ message: `Error creating parking: ${error.message}` });
  }
};

const getParkingByZoneController = async (req, res, next) => {
    try {
      const zone = req.query.zone;
      console.log(zone);
      const parking = await parkingService.getParkingByZone(zone, next);
      if (!parking) {
        return res.status(404).json({ message: "Parking not found" });
      }
      res.status(200).json(parking);
    } catch (error) {
      res.status(500).json({ message: `Error fetching parking by zone: ${error.message}` });
    }
};

const getSuggestedSlotController = async (req, res, next) => {
  try {
    const parkingId = req.params.parkingId;
    const slot = await parkingService.findEnptySlot(parkingId, next);
    res.status(200).json(slot);
  } catch (error) {
    res.status(500).json({ message: `Error fetching suggested slot: ${error.message}` });
  }
};

const updateParkingController = async (req, res, next) => {
  try {
    const parkingId = req.body.parkingId;
    const data = req.body.data;

    const updatedParking = await parkingService.update(parkingId, data, next);
    res.status(200).json(updatedParking);
  } catch (error) {
    res.status(500).json({ message: `Error updating parking: ${error.message}` });
  }
}

const deleteParkingController = async (req, res, next) => {
  try {
    const parkingId = req.params.parkingId;

    const deletedParking = await parkingService.deleteParking(parkingId);
    res.status(204).json(deletedParking);
  } catch (error) {
    res.status(500).json({ message: `Error deleting parking: ${error.message}` });
  }
}

const parkingController = {
  createParkingController,
  getParkingByZoneController,
  updateParkingController,
  deleteParkingController
}

export default parkingController;

