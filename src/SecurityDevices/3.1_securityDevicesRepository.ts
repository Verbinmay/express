import {SecurityDevicesModelClass} from "../db";
import {JwtPayload} from "jsonwebtoken";
import {SecurityDevicesDBModel} from "./4_securityDevicesType";
import {injectable} from "inversify";

@injectable()
export class SecurityDevicesRepository {

    async checkRefreshTokenEqual(a: { iat: number, deviceId: string, userId: string }) {
        const result: SecurityDevicesDBModel | null =
            await SecurityDevicesModelClass.findOne({
                lastActiveDate: new Date(a.iat * 1000).toISOString(),
                deviceId: a.deviceId,
                userId: a.userId,
            });
        return result != null;
    }

    //DELETE SESSION BY ID AND DEVICE ID
    async deleteSessions(a: {
        userId: string,
        deviceId: string
    }) {
        await SecurityDevicesModelClass.deleteMany({
            userId: a.userId,
            deviceId: {$ne: a.deviceId},
        });
        return true;
    }

    //LOGOUT
    async deleteSessionLogout(a: { userId: string, deviceId: string }) {
        const result = await SecurityDevicesModelClass.deleteOne({
            userId: a.userId,
            deviceId: a.deviceId,
        });
        return result.deletedCount === 1;
    }

    //DELETE SESSION BY DEVICE ID
    async deleteSessionsByDeviceId(deviceId: string) {
        const result = await SecurityDevicesModelClass.deleteOne({
            deviceId: deviceId,
        });
        return result.deletedCount === 1;
    }

    //CREATE SESSION
    async createSession(newSession: any) {
       const result =  await SecurityDevicesModelClass.create(newSession);

        return true;
    }

    //UPDATE INFO REFRESH NEW SESSION
    async updateSessionRefreshInfo(a: { iatOldSession: number, decoded: JwtPayload }) {
        const result = await SecurityDevicesModelClass.updateOne(
            {
                lastActiveDate: new Date(a.iatOldSession * 1000).toISOString(),
                deviceId: a.decoded.deviceId!,
                userId: a.decoded.userId!,
            },
            {
                $set: {
                    lastActiveDate: new Date(a.decoded.iat! * 1000).toISOString(),
                    expireDate: new Date(a.decoded.exp! * 1000).toISOString(),
                },
            }
        );
        return result.matchedCount === 1;
    }
}
