import {AuthService} from "./2_authService";
import {Request, Response} from "express";
import {CreatedTokenModel, MeViewModel} from "./4_authType";
import {errorMaker, tokenCreator} from "../functions";
import {UserDBModel, UserViewModel} from "../Users/4_userType";
import {UsersService} from "../Users/2_usersService";
import {SecurityDevicesService} from "../SecurityDevices/2_securityDevicesService";
import {inject, injectable} from "inversify";
import {TYPES} from "../iocTYPES";

@injectable()
export class AuthController {
    constructor(
        @inject(TYPES.AuthService) protected authService: AuthService,
        @inject(TYPES.UsersService) protected usersService: UsersService,
        @inject(TYPES.SecurityDevicesService) protected securityDevicesService:SecurityDevicesService
    ) {
    }

    async login(req: Request, res: Response) {
        const authPost: CreatedTokenModel | null = await this.authService.postAuth({
            loginOrEmail: req.body.loginOrEmail,
            password: req.body.password,
            ip: req.ip,
            title: req.headers["user-agent"] ? req.headers["user-agent"] : "default"
        });

        if (!authPost) {
            res.sendStatus(401)
            return
        }

        res.cookie("refreshToken", authPost.refreshToken, {
            httpOnly: true,
            secure: true,
        });

        res.status(200).send(authPost.accessToken);
    }

    async refreshToken(req: Request, res: Response) {
        const newTokens: CreatedTokenModel = await tokenCreator({
            userId: req.user.userId,
            deviceId: req.user.deviceId
        });

        //refreshToken Changed in DB
        await this.securityDevicesService.changeRefreshTokenInfo({
            newToken: newTokens.refreshToken,
            iatOldSession: req.user.iat
        });

        res.cookie("refreshToken", newTokens.refreshToken, {
            httpOnly: true,
            secure: true,
        });

        res.status(200).send(newTokens.accessToken);
    }

    async logout(req: Request, res: Response) {
        const tokenRevoked = await this.securityDevicesService.deleteSessionLogout({
            userId: req.user.userId,
            deviceId: req.user.deviceId,
        });

        tokenRevoked ?
            res.sendStatus(204) : res.sendStatus(401);
    }

    async me(req: Request, res: Response) {
        const authGet: UserViewModel | null = await this.usersService.findUserById(
            req.user.userId
        );

        const viewAuthGet: MeViewModel = {
            email: authGet!.email,
            login: authGet!.login,
            userId: authGet!.id,
        };

        res.status(200).send(viewAuthGet);
    }

    async registration(req: Request, res: Response) {
        //todo тут сам тест так стремно написан, что нужно изворациваться

        const emailFinder: UserDBModel | null = await this.authService.findUserByLoginOrEmail(
            req.body.email
        );

        if (emailFinder) {
            res.status(400).send(errorMaker("login or email already exists", "email"));
            return;
        }

        const loginFinder: UserDBModel | null = await this.authService.findUserByLoginOrEmail(
            req.body.login
        );

        if (loginFinder) {
            res.status(400).send(errorMaker("login or email already exists", "login"));
            return;
        }

        const registration: boolean = await this.authService.registration({
            login: req.body.login,
            email: req.body.email,
            password: req.body.password
        });

        res.sendStatus(204);
    }

    async registrationConfirmation(req: Request, res: Response) {
        const confirmPost: boolean = await this.authService.confirmEmail(req.body.code);
        if (confirmPost) {
            res.sendStatus(204);
        } else {
            res.status(400).send(errorMaker("If the confirmation code is incorrect, expired or already been applied", "code"));
        }
    }

    async emailResending(req: Request, res: Response) {
        const emailResendingPost: boolean = await this.authService.resendingEmail(req.body.email);

        if (!emailResendingPost) {
            res.status(400).send(errorMaker(" inputModel has incorrect values or if email is already confirmed", "email")
            );
            return
        }

        res.send(204);
    }

    async passwordRecovery(req: Request, res: Response) {
        const recovery: boolean = await this.authService.resendingPassword(req.body.email);

        res.sendStatus(204);
    }

    async newPassword(req: Request, res: Response) {
        const confirmPost: boolean = await this.authService.confirmPassword({
            code: req.body.recoveryCode,
            password: req.body.newPassword
        })

        if (confirmPost) {
            res.sendStatus(204);
        } else {
            res.status(400).send(errorMaker("If the confirmation code is incorrect, expired or already been applied", "recoveryCode"));
        }
    }
}