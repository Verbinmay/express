import {UserModelClass} from "../db";
import {injectable} from "inversify";
@injectable()
export class UsersRepository {
    //POST
    async createUser(user: any) {
        return await UserModelClass.create(user).then(doc => doc.toObject());
    }

    //DELETE
    async deleteUser(id: string) {
        try {
            const result = await UserModelClass.findByIdAndDelete(id);
            return true
        } catch (e) {
            return false
        }
    }
}





