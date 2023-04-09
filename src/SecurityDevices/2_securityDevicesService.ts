import {JwtPayload} from "jsonwebtoken";
import {SecurityDevicesRepository} from "./3.1_securityDevicesRepository";
import {SecurityDevicesQRepository} from "./3.0_securityDevicesQueryRepository";
import {mapSecurityDevices} from "../functions";
import {SecurityDevicesDBModel} from "./4_securityDevicesType";
import {JwtService} from "../JWT/jwtService";
import {inject, injectable} from "inversify";
import {TYPES} from "../iocTYPES";
@injectable()
export class SecurityDevicesService {
    constructor(
        @inject(TYPES.SecurityDevicesRepository) protected securityDevicesRepository: SecurityDevicesRepository,
        @inject(TYPES.SecurityDevicesQRepository) protected securityDevicesQRepository: SecurityDevicesQRepository,
        @inject(TYPES.JwtService) protected jwtService: JwtService
    ) {
    }

    //FIND SESSION BY ID
    async findSessionsById(userId: string) {
        const result: Array<SecurityDevicesDBModel> = await this.securityDevicesQRepository.findSessionsById(userId)
        return result.map((m => {
            return mapSecurityDevices(m)
        }))
    }

    ////FIND SESSION BY DEVICE ID
    async findSessionByDeviceId(deviceId: string) {
        const result: SecurityDevicesDBModel | null = await this.securityDevicesQRepository.findSessionByDeviceId(deviceId)
        return result
    }

    //DELETE SESSION BY ID AND DEVICE ID
    async deleteSessions(a: {
        userId: string,
        deviceId: string
    }) {
        return await this.securityDevicesRepository.deleteSessions(a);
    }

    //LOGOUT
    async deleteSessionLogout(a: { userId: string, deviceId: string }) {
        return await this.securityDevicesRepository.deleteSessionLogout(a);
    }


    //DELETE SESSION BY DEVICE ID
    async deleteSessionsByDeviceId(deviceId: string) {
        return await this.securityDevicesRepository.deleteSessionsByDeviceId(deviceId);
    }

    async createSession(
        a: {
            iat: number,
            expirationDate: number,
            ip: string,
            title: string,
            deviceId: string,
            userId: string
        }) {
        const newSession = {
            lastActiveDate: new Date(a.iat * 1000).toISOString(),
            expirationDate: new Date(a.expirationDate * 1000).toISOString(),
            ip: a.ip,
            title: a.title,
            deviceId: a.deviceId,
            userId: a.userId,
        };
        return await this.securityDevicesRepository.createSession(
            newSession
        );
    }

    //UPDATE INFO IN DB ABOUT NEW REFRESH
    async changeRefreshTokenInfo(a: { newToken: string, iatOldSession: number }) {
        const decoded: JwtPayload = await this.jwtService.decoderJWTs(a.newToken);
        return await this.securityDevicesRepository.updateSessionRefreshInfo({
            iatOldSession: a.iatOldSession,
            decoded: decoded
        });
    }
    // async checkUserDevices(userId: string, deviceId: string) {
    //     const result: SecurityDevicesDBModel | null =
    //         await securityDevicesQueryRepository.findSessionByDeviceId(deviceId);
    //     if (result) {
    //         if (result.userId === userId) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     } else {
    //         return false;
    //     }
    // },
}
