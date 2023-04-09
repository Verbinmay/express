import {UserModelClass} from "../db";
import {UserDBModel} from "../Users/4_userType";
import {injectable} from "inversify";

@injectable()
export class AuthQRepository {

//GET USER BY LOGIN OR EMAIL
    async findUserByLoginOrEmail(loginOrEmail: string) {
        const result: UserDBModel | null = await UserModelClass.findOne({
            $or: [{login: loginOrEmail}, {email: loginOrEmail}],
        }).lean();
        return result;
    }
}