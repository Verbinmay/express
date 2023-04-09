import bcrypt from "bcrypt";
import {AuthRepository} from "./3.1_authRepository";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {tokenCreator} from "../functions";
import {CreatedTokenModel} from "./4_authType";
import {JwtPayload} from "jsonwebtoken";
import {AuthQRepository} from "./3.0_authQueryRepository";
import {UserDBModel} from "../Users/4_userType";
import {recoveryPasswordMessage, registrationMessage} from "../Email/messages";
import {ObjectId} from "mongodb";
import {UsersRepository} from "../Users/3.1_usersRepository";
import {SecurityDevicesService} from "../SecurityDevices/2_securityDevicesService";
import {EmailsAdapter} from "../Email/emailAdapter";
import {JwtService} from "../JWT/jwtService";
import {inject, injectable} from "inversify";
import {TYPES} from "../iocTYPES";

@injectable()
export class AuthService {

    constructor(
        @inject(TYPES.AuthRepository) protected authRepository: AuthRepository,
        @inject(TYPES.AuthQRepository)protected authQRepository: AuthQRepository,
        @inject(TYPES.UsersRepository) protected usersRepository: UsersRepository,
        @inject(TYPES.SecurityDevicesService) protected securityDevicesService: SecurityDevicesService,
        @inject(TYPES.EmailsAdapter) protected emailsAdapter: EmailsAdapter,
        @inject(TYPES.JwtService) protected jwtService: JwtService
    ) {
    }

    //AUTH POST
    async postAuth(a: {
        loginOrEmail: string,
        password: string,
        ip: string,
        title: string
    }) {
        const user: UserDBModel | null =
            await this.authQRepository.findUserByLoginOrEmail(a.loginOrEmail);

        if (!user) return null

        const match: boolean = await bcrypt.compare(
            a.password,
            user.hash
        );

        if (!match) return null

        const deviceId: string = uuidv4().toString();

        const tokens: CreatedTokenModel = await tokenCreator({
            userId: user._id.toString(),
            deviceId: deviceId
        });

        const decoder: JwtPayload = await this.jwtService.decoderJWTs(tokens.refreshToken);
//todo security
        const sessionCreate: boolean =
            await this.securityDevicesService.createSession({
                iat: decoder.iat!,
                expirationDate: decoder.exp!,
                ip: a.ip,
                title: a.title,
                deviceId: deviceId,
                userId: user._id.toString()
            });

        return sessionCreate ? tokens : null;
    }


    //CREATE USER AND SEND EMAIL
    async registration(a: { login: string, email: string, password: string }) {
        const hashBcrypt = await bcrypt.hash(a.password, 10);

        const createdUser =
            new UserDBModel(
                new ObjectId(),
                a.login,
                a.email,
                new Date(),
                new Date(),
                hashBcrypt,
                {
                    confirmationCode: uuidv4(),
                    expirationDate: add(new Date(), {
                        hours: 1,
                        minutes: 3,
                    }),
                    isConfirmed: false
                })


        const user: UserDBModel = await this.usersRepository.createUser(createdUser);
        const message = registrationMessage(
            user.emailConfirmation.confirmationCode
        );
        await this.emailsAdapter.sendEmail({
            email: a.email,
            subject: message.subject,
            message: message.result
        });

        return true;
    }

    //CONFIRM EMAIL
    async confirmEmail(code: string) {
        const userFind: UserDBModel | null =
            await this.authRepository.findUserByConfirmationCode(code);
        if (!userFind) {
            return false;
        }
        if (userFind.emailConfirmation.isConfirmed) {
            return false;
        }
        if (userFind.emailConfirmation.confirmationCode !== code) {
            return false;
        }
        if (userFind.emailConfirmation.expirationDate < new Date()) {
            return false;
        }
        return await this.authRepository.updateConfirmation(
            userFind._id.toString()
        );
    }

    //RESENDING EMAIL
    // todo переделпть по иному
    async resendingEmail(email: string) {
        const userFind = await this.authRepository.findUserByEmail(email);

        if (!userFind) {
            return false;
        }
        if (userFind.emailConfirmation.isConfirmed) {
            return false;
        }
        const confirmationCode = uuidv4();
        const expirationDate = add(new Date(), {
            hours: 1,
            minutes: 3,
        });
        const userUpdate: boolean = await this.authRepository.updateCodeAndDate({
            confirmationCode: confirmationCode,
            expirationDate: expirationDate,
            user: userFind
        });
        const message = registrationMessage(
            confirmationCode
        );
        await this.emailsAdapter.sendEmail({
                email: email,
                subject: message.subject,
                message: message.result
            }
        );

        return true;
    }

// password recovery

    async resendingPassword(email: string) {

        const confirmationCode = uuidv4().toString();
        const userFind: UserDBModel | null = await this.authRepository.findUserByEmail(email);
        if (userFind) {
            const message = recoveryPasswordMessage(confirmationCode);
            await this.emailsAdapter.sendEmail({
                    email: email,
                    subject: message.subject,
                    message: message.result
                }
            );
            const expirationDate = add(new Date(), {
                hours: 1,
                minutes: 3,
            });
            const userUpdate: boolean = await this.authRepository.updateCodeAndDate({
                confirmationCode: confirmationCode,
                expirationDate: expirationDate,
                user: userFind
            });

        }
        return true
    }

    // CONFIRM PASSWORD RECOVERY
    async confirmPassword(a: { code: string, password: string }) {
        const userFind: UserDBModel | null =
            await this.authRepository.findUserByConfirmationCode(a.code);
        if (!userFind) {
            return false;
        }
        if (userFind.emailConfirmation.confirmationCode !== a.code) {
            return false;
        }
        if (userFind.emailConfirmation.expirationDate < new Date()) {
            return false;
        }
        const hashBcrypt = await bcrypt.hash(a.password, 10);
        return await this.authRepository.updateConfirmationAndHash(
            {id: userFind._id.toString(), hash: hashBcrypt}
        );
    }

    // FIND LOGIN OR EMAIL
    async findUserByLoginOrEmail(loginOrEmail: string) {
        return await this.authQRepository.findUserByLoginOrEmail(loginOrEmail)
    }
}
