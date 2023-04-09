import {ObjectId} from "mongodb";

export type PostInputModel = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
};

export type PostViewModel = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
};

export class PostDBModel {
    constructor(
        public _id: ObjectId,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: Date,
        public updatedAt: Date,
    ) {
    }
};