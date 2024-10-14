import express from "express";
import connectDB from "./config/mongoose.js";
import route from "./routes/index.js";
import { env } from './config/enviroment.js';
import cors from 'cors';
const app = express();

connectDB();

// Cấu hình CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use(express.json())

route(app);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});