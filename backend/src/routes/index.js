import { parkingRoute } from "./parkingRoute.js"
import { personRoute} from "./personRoute.js"

const route = (app) => {
    app.use('/parking', parkingRoute);
    app.use('/person', personRoute);
}

export default route