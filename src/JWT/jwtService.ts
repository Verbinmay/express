import jwt, {JwtPayload} from "jsonwebtoken";
import {setting} from "../settings";
import jwtDecode from "jwt-decode";
import {SecurityDevicesRepository} from "../SecurityDevices/3.1_securityDevicesRepository";
import {inject, injectable} from "inversify";
import {TYPES} from "../iocTYPES";


@injectable()
export class JwtService {
    constructor(
        @inject(TYPES.SecurityDevicesRepository) protected securityDevicesRepository:SecurityDevicesRepository
    ) {
    }

    async createJWTAccessToken(id: string) {
        return jwt.sign({userId: id}, setting.JWT_SECRET, {
            expiresIn: "600s",
        });
    }

    async createJWTRefreshToken(a: { deviceId: string, userId: string }) {
        return jwt.sign(
            {deviceId: a.deviceId, userId: a.userId},
            setting.JWT_SECRET,
            {
                expiresIn: "500000s",
            }
        );
    }

    async verifyToken(token: string) {
        try {
            const result = await jwt.verify(token, setting.JWT_SECRET);
            if (typeof result === "string") return null
            if (!result.deviceId) return result;
            const session: boolean = await this.securityDevicesRepository.checkRefreshTokenEqual({
                iat: result.iat!,
                deviceId: result.deviceId,
                userId: result.userId
            });
            return session ? result : null

        } catch {
            return null;
        }
    }

    async decoderJWTs(token: string) {
        //DONT WRITE INLINE
        const a: JwtPayload = await jwtDecode(token);
        return a
    }
}
