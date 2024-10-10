import { parkingRoute } from "./parkingRoute.js"
import { personRoute} from "./personRoute.js"
import { vehicleRoute} from "./vehicleRoute.js"

const route = (app) => {
    app.use('/parking', parkingRoute);
    app.use('/person', personRoute);
    app.use('/vehicles', vehicleRoute);
}

export default route