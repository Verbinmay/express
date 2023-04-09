import {ObjectId} from "mongodb";

export type BlogInputModel = {
    name: string;
    description: string;
    websiteUrl: string;
};

export type BlogPostInputModel = {
    title: string;
    shortDescription: string;
    content: string;
};

export type BlogViewModel = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
};

export class BlogDBModel {
    constructor(
        public _id: ObjectId,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: Date,
        public updatedAt: Date,
        public isMembership: boolean,
    ) {
    }
}
