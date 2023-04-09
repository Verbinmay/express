import {IpDataDBModel} from "./ipDataType";
import {IpDataModelClass} from "../db";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class IpDataRepository {
    async checkIpData(a: {
        ip: string,
        timeInSec: number,
        attempts: number,
        route: string
    }) {
        const dateInMLS = Date.now() - a.timeInSec * 1000;
        const result: Array<IpDataDBModel> = await IpDataModelClass
            .find({ip: a.ip, route: a.route, data: {$gte: dateInMLS}})

        return result.length < a.attempts;
    }

    async addIpData(a: { ip: string, route: string }) {
        const newIpData = new IpDataDBModel(
            new ObjectId(),
            a.ip,
            Date.now(),
            a.route,
        )
        await IpDataModelClass.create(newIpData);
        return true;
    }
}
