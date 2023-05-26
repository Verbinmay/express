import {
  emailCreateValidation,
  inputValidationMiddleware,
  loginCreateValidation,
  loginOrEmailValidation,
  newPasswordValidation,
  passwordCreateValidation,
  passwordValidation,
} from "../middlewares/inputValidationMiddleware";
import { Router } from "express";

import {
  AccessTokenMiddleware,
  RefreshTokenMiddleware,
} from "../middlewares/authMiddleware";
import { ipDataMiddleware } from "../middlewares/ipDataMiddleware";
import { container } from "../composition-root";
import { AuthController } from "./1.1_authController";

const authController = container.resolve(AuthController);

export const authRouter = Router({});

//AUTH POST
authRouter.post(
  "/login",
  ipDataMiddleware,
  loginOrEmailValidation,
  passwordValidation,
  inputValidationMiddleware,
  authController.login.bind(authController)
);

authRouter.post(
  "/refresh-token",
  RefreshTokenMiddleware,
  authController.refreshToken.bind(authController)
);

authRouter.post(
  "/logout",
  RefreshTokenMiddleware,
  authController.logout.bind(authController)
);

authRouter.get(
  "/me",
  AccessTokenMiddleware,
  authController.me.bind(authController)
);

//REGISTRATION
authRouter.post(
  "/registration",
  ipDataMiddleware,
  loginCreateValidation,
  passwordCreateValidation,
  emailCreateValidation,
  inputValidationMiddleware,
  authController.registration.bind(authController)
);

//CONFIRM REGISTRATION
authRouter.post(
  "/registration-confirmation",
  ipDataMiddleware,
  authController.registrationConfirmation.bind(authController)
);

//REGISTRATION EMAIL RESENDING
authRouter.post(
  "/registration-email-resending",
  ipDataMiddleware,
  authController.emailResending.bind(authController)
);

authRouter.post(
  "/password-recovery",
  ipDataMiddleware,
  emailCreateValidation,
  inputValidationMiddleware,
  authController.passwordRecovery.bind(authController)
);

//CONFIRM PASSWORD RECOVERY
authRouter.post(
  "/new-password",
  ipDataMiddleware,
  newPasswordValidation,
  inputValidationMiddleware,
  authController.newPassword.bind(authController)
);
