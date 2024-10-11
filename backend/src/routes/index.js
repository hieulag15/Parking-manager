import { parkingRoute } from "./parkingRoute.js";
import { personRoute } from "./personRoute.js";
import { authRoute } from "./authRoute.js";

const route = (app) => {
  app.use("/parking", parkingRoute);
  app.use("/person", personRoute);
  app.use("/auth", authRoute);
};

export default route;
