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

const parkingController = {
  createParkingController,
  getParkingByZoneController
}

export default parkingController;

