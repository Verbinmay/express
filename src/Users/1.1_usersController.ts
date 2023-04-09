import {UsersService} from "./2_usersService";
import {Request, Response} from "express";
import {UserViewModel} from "./4_userType";
import {PaginatorStart, PaginatorUser} from "../Paginator/paginatorType";
import {paginator} from "../Paginator/paginator";
import {inject, injectable} from "inversify";
import {TYPES} from "../iocTYPES";

@injectable()
export class UsersController {
    constructor(
        @inject(TYPES.UsersService) protected usersService: UsersService) {
    }

    async createUser(req: Request, res: Response) {

        const userPost: UserViewModel = await this.usersService.createUser({
            login: req.body.login,
            password: req.body.password,
            email: req.body.email
        });

        res.status(201).send(userPost);
    }

    async getUsers(req: Request, res: Response) {
        const paginatorInformation: PaginatorStart = paginator(req.query);

        const usersGet: PaginatorUser = await this.usersService.findUsers(paginatorInformation);

        res.status(200).send(usersGet);
    }

    async deleteUser(req: Request, res: Response) {
        const userDelete: boolean = await this.usersService.deleteUser(req.params.id);
        userDelete ?
            res.sendStatus(204) : res.sendStatus(404)
    }
}