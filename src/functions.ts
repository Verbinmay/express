import {FieldError} from "./helper-type/errorsType";
import {JwtPayload} from "jsonwebtoken";
import { container, jwtService } from "./composition-root";
import { JwtService } from "./JWT/jwtService";
import { TYPES } from "./iocTYPES";



export function errorMaker(msg: string, field: string, ...strings: any[]) {
    let arrayErrors: Array<FieldError> = [];
    arrayErrors.push({
        message: msg,
        field: field,
    });
    if (strings.length > 0) {
        for (let i = 0; i > strings.length; i + 2) {
            arrayErrors.push({
                message: strings[i],
                field: strings[i + 1],
            });
        }
    }
    return {errorsMessages: arrayErrors};
}

export async function tokenCreator(a: { userId: string, deviceId: string }) {
    const tokenAccess = await jwtService.createJWTAccessToken(a.userId);
    const tokenRefresh = await jwtService.createJWTRefreshToken({deviceId: a.deviceId, userId: a.userId});

    return {
        accessToken: {accessToken: tokenAccess},
        refreshToken: tokenRefresh,
    };
}

export async function getUserIdFromAccessToken(headersAuthorization: any) {
    let userId = ""

    if (headersAuthorization) {
        const token = headersAuthorization.split(" ")[1];

        const verify: JwtPayload | null = await jwtService.verifyToken(token!);
        if (verify) {
            userId = verify.userId
        }
    }
    return userId
}



