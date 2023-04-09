import {ObjectId} from "mongodb";

export type CommentInputModel = {
    content: string;
};

export type CommentatorInfo = {
    userId: string;
    userLogin: string;
};

export type CommentViewModel = {
    id: string;
    content: string;
    commentatorInfo: CommentatorInfo;
    createdAt: string;
};
export type CommentWithLikeViewModel = {
    id: string;
    content: string;
    commentatorInfo: CommentatorInfo;
    createdAt: string;
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string
    }
};

export class CommentDBModel {
    constructor(
        public _id: ObjectId,
        public content: string,
        public commentatorInfo: {
            userId: string,
            userLogin: string,
        },
        public createdAt: Date,
        public updatedAt: Date,
        public postId: string,
        public likesInfo: {
            likesCount:String[],
            dislikesCount: String[],
            myStatus: string
        }
    ) {
    }
}