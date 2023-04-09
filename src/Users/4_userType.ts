import {ObjectId} from "mongodb";

export type UserInputModel = {
    login: string;
    password: string;
    email: string;
};

export type UserViewModel = {
    id: string;
    login: string;
    email: string;
    createdAt: string;
};


export class UserDBModel {
    constructor(
        public _id: ObjectId,
        public login: string,
        public email: string,
        public createdAt: Date,
        public updatedAt: Date,
        public hash: string,
        public emailConfirmation: {
            confirmationCode: string,
            expirationDate: Date,
            isConfirmed: boolean,
        }
    ) {

    }

}