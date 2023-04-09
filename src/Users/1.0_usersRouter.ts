import {Router} from "express";
import {basicValidationMiddleware} from "../middlewares/basicMiddleware";
import {
    emailCreateValidation,
    inputValidationMiddleware,
    loginCreateValidation,
    passwordCreateValidation,
} from "../middlewares/inputValidationMiddleware";
import {container} from "../composition-root";
import {UsersController} from "./1.1_usersController";

const usersController = container.resolve(UsersController)

export const usersRouter = Router({});

//POST
usersRouter.post(
    "/",
    basicValidationMiddleware,
    loginCreateValidation,
    passwordCreateValidation,
    emailCreateValidation,
    inputValidationMiddleware,
    usersController.createUser.bind(usersController)
);

//GET
usersRouter.get(
    "/",
    basicValidationMiddleware,
    usersController.getUsers.bind(usersController)
);

//DELETE
usersRouter.delete(
    "/:id",
    basicValidationMiddleware,
    usersController.deleteUser.bind(usersController)
);
