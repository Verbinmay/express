import {ObjectId} from "mongodb";

export type SecurityDevicesViewModel = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string,

}


export class SecurityDevicesDBModel {
    constructor(public _id: ObjectId,
                public ip: string,
                public title: string,
                public lastActiveDate: string,
                public expirationDate: string,
                public deviceId: string,
                public userId: string) {
    }

}