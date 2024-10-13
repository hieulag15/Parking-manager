import { createParking, getParkingByZone } from '../services/parkingService.js';

export const createParkingController = async (req, res) => {
  try {
    const parkingData = req.body;
    const newParking = await createParking(parkingData);
    res.status(201).json(newParking);
  } catch (error) {
    res.status(500).json({ message: `Error creating parking: ${error.message}` });
  }
};

export const getParkingByZoneController = async (req, res) => {
    try {
      const zone = req.query.zone;
      console.log(zone);
      const parking = await getParkingByZone(zone);
      if (!parking) {
        return res.status(404).json({ message: "Parking not found" });
      }
      res.status(200).json(parking);
    } catch (error) {
      res.status(500).json({ message: `Error fetching parking by zone: ${error.message}` });
    }
};

