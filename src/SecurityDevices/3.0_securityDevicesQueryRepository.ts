import {SecurityDevicesModelClass} from "../db";
import {SecurityDevicesDBModel} from "./4_securityDevicesType";
import {injectable} from "inversify";
@injectable()

export class SecurityDevicesQRepository {
    //FIND SESSIONS BY USER ID
    async findSessionsById(userId: string) {
        const result: Array<SecurityDevicesDBModel> =
            await SecurityDevicesModelClass.find({userId: userId});

        return result;
    }

    //FIND SESSION BY DEVICE ID
    async findSessionByDeviceId(deviceId: string) {
        const result: SecurityDevicesDBModel | null =
            await SecurityDevicesModelClass.findOne({deviceId: deviceId});
        return result;
    }

}