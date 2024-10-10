import express from "express";
import { personController , createNew} from "../controllers/personController.js";

const Router = express.Router();

Router.post('/', personController.createNew)

Router.route("/")
.put(personController.updateUser)
.delete(personController.deleteUser);


// Router.route('/addMany')
// .post(personController.createMany);

Router.route('/deleteMany')
.post(personController.deleteMany);

Router.route('/deleteAll')
.delete(personController.deleteAll);

export const personRoute = Router;