import {UserModelClass} from "../db";
import {UserDBModel} from "./4_userType";
import {injectable} from "inversify";

@injectable()
export class UsersQRepository  {

    //GET
    async findUsers(a: {
        filter: {},
        filterSort: any,
        pageNumber: number,
        pageSize: number
    }) {

        const result: UserDBModel[] = await UserModelClass
            .find(a.filter)
            .sort(a.filterSort)
            .skip((a.pageNumber - 1) * a.pageSize)
            .limit(a.pageSize)
            .lean()


        return result;
    }

    //GET BY ID
    async findUserById(id: string) {
        try {
            const result: UserDBModel | null = await UserModelClass.findById(id).lean();

            return result;
        } catch (e) {

            return null
        }
    }
}

