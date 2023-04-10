import { ObjectId } from "mongodb";

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

export type PostWithLikeViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: likeInfo[];
  };
};

export type likeInfo = {
  addedAt: string;
  userId: string;
  login: string;
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
    public extendedLikesInfo: {
      likesCount: likeInfo[];
      dislikesCount: likeInfo[];
      myStatus: string;
      newestLikes: likeInfo[];
    }
  ) {}
}
