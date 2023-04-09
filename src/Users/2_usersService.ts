import bcrypt from "bcrypt";
import {UsersRepository} from "./3.1_usersRepository";
import { mapUser } from "../map";
import {PaginatorStart, PaginatorUser} from "../Paginator/paginatorType";
import {countTotalAndPages, createFilterSort} from "../Paginator/paginator";
import {UserModelClass} from "../db";
import {UserDBModel, UserViewModel} from "./4_userType";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";
import {TYPES} from "../iocTYPES";
import { UsersQRepository } from "./3.0_usersQueryRepository";

@injectable()
export class UsersService {
    constructor(
        @inject(TYPES.UsersRepository)protected usersRepository: UsersRepository,
        @inject(TYPES.UsersQRepository)protected usersQRepository: UsersQRepository
    ) {
    }

    //GET
    async findUsers(paginator: PaginatorStart) {
        let filter: any = {}
        if (paginator.searchLoginTerm ||
            paginator.searchEmailTerm) {
            filter = {
                $or: [{login: {$regex: "(?i)" + paginator.searchLoginTerm + "(?-i)"}}, {email: {$regex: "(?i)" + paginator.searchEmailTerm + "(?-i)"}}]
            }
        } else if (paginator.searchLoginTerm) {
            filter = {
                login: {$regex: "(?i)" + paginator.searchLoginTerm + "(?-i)"}
            }
        } else if (paginator.searchEmailTerm) {
            filter = {email: {$regex: "(?i)" + paginator.searchEmailTerm + "(?-i)"}}
        } else {
            filter = {}
        }

        const filterSort: any = createFilterSort(
            {
                sortBy: paginator.sortBy,
                sortDirection: paginator.sortDirection
            }
        );
        const counterPages: {
            pagesCount: number;
            totalCount: number;
        } = await countTotalAndPages({
            modelClass: UserModelClass,
            filter: filter,
            pageSize: paginator.pageSize
        });
        const userFromDB: UserDBModel[] = await this.usersQRepository.findUsers({
            filter: filter,
            filterSort: filterSort,
            pageNumber: paginator.pageNumber,
            pageSize: paginator.pageSize
        })
        const users: UserViewModel[] = userFromDB.map(m => {
            return mapUser(m)
        })

        const result: PaginatorUser = {
            pagesCount: counterPages.pagesCount,
            page: paginator.pageNumber,
            pageSize: paginator.pageSize,
            totalCount: counterPages.totalCount,
            items: users
        };
        return result
    }

    //GET BY ID
    async findUserById(id: string) {
        const userFromDB: UserDBModel | null = await this.usersQRepository.findUserById(id)

        return userFromDB ? mapUser(userFromDB) : null
    }

    //POST
    async createUser(a: { login: string, password: string, email: string }) {
        const hashBcrypt = await bcrypt.hash(a.password, 10);

        const user = new UserDBModel(
            new ObjectId(),
            a.login,
            a.email,
            new Date(),
            new Date(),
            hashBcrypt,
            {
                confirmationCode: "default",
                expirationDate: new Date(),
                isConfirmed: true
            })

        const userInDB: UserDBModel = await this.usersRepository.createUser(user);

        return mapUser(userInDB);
    }

    //DELETE
    async deleteUser(id: string) {
        return await this.usersRepository.deleteUser(id);
    }
}


