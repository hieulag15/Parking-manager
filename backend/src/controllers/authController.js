import { StatusCodes } from "http-status-codes";
import { personService } from "../services/personService.js";

const login = async (req, res) => {
    try {
        const loginUser = await personService.login(req, res);
        console.log('body: ' + JSON.stringify(req));
        res.status(StatusCodes.OK).json(loginUser);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Error logging in: ${error.message}` });
    }
}

export const authController = {
    login,
};