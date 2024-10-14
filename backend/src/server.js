import express from "express";
import connectDB from "./config/mongoose.js";
import route from "./routes/index.js";
import { env } from './config/enviroment.js';
const app = express();

connectDB();

app.use(express.json())

route(app);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});