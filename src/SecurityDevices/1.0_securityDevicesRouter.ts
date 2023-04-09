import {Router} from "express";
import {RefreshTokenMiddleware} from "../middlewares/authMiddleware";
import {container} from "../composition-root";
import {SecurityController} from "./1.1_securityController";

const securityController = container.resolve(SecurityController)

export const securityRouter = Router({});


securityRouter.get(
    "/devices",
    RefreshTokenMiddleware,
    securityController.getDevice.bind(securityController));


//DELETE SESSION BY ID AND DEVICE ID
securityRouter.delete(
    "/devices",
    RefreshTokenMiddleware,
    securityController.deleteAllDevices.bind(securityController)
);

//--------------------
securityRouter.delete(
    "/devices/:deviceId",
    RefreshTokenMiddleware,
    securityController.deleteOneDevice.bind(securityController)
);
