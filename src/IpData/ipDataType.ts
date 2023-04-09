import {ObjectId} from "mongodb";

export class IpDataDBModel {
    constructor(protected _id: ObjectId,
                protected ip: string,
                protected data: number,
                protected route: string,
    ) {
    }
}
