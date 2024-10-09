import express from "express";
import connectDB from "./src/config/mongoose.js";

const app = express();

connectDB();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});