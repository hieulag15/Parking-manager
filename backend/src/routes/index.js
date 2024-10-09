import express from "express"
import { parkingRoute } from "./parkingRoute.js"

const Router = express.Router()

// API user
Router.use('/parking', parkingRoute)

export const APIs_V1 = Router