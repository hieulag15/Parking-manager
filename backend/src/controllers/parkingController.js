import { createParking } from '../models/parkingModel.js';

// Controller để xử lý yêu cầu tạo mới một tài liệu parking
export const createParkingController = async (req, res) => {
  try {
    const parkingData = req.body;
    const newParking = await createParking(parkingData);
    res.status(201).json(newParking);
  } catch (error) {
    res.status(500).json({ message: `Error creating parking: ${error.message}` });
  }
};