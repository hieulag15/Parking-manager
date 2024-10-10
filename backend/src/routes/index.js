import { parkingRoute } from "./parkingRoute.js"

const route = (app) => {
    app.use('/parking', parkingRoute);
}

export default route