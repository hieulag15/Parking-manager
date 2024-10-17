import { parkingRoute } from "./parkingRoute.js"
import { personRoute} from "./personRoute.js"
import { vehicleRoute} from "./vehicleRoute.js"
import { authRoute } from "./authRoute.js";
import { parkingTurnRoute } from "./parkingTurnRoute.js";
import { driverRoute } from "./driverRoute.js";
import { eventRoute } from "./eventRoute.js";

const route = (app) => {
    app.use('/parking', parkingRoute);
    app.use('/parking-turn', parkingTurnRoute);
    app.use('/person', personRoute);
    app.use('/vehicle', vehicleRoute);
    app.use('/auth', authRoute);
    app.use('/driver', driverRoute);
    app.use('/event', eventRoute)
}

export default route;
