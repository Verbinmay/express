import {BlogViewModel} from "../Blogs/4_blogsType";
import {CommentViewModel, CommentWithLikeViewModel} from "../Comments/4_commentsType";
import {PostViewModel} from "../Posts/4_postsType";
import {UserViewModel} from "../Users/4_userType";
import { mapCommentWithLike } from "../map";

export type PaginatorStart = {
    searchNameTerm: string | null;
    sortBy: string;
    sortDirection: string;
    pageNumber: number;
    pageSize: number;
    searchLoginTerm: string | null;
    searchEmailTerm: string | null;
};

export type PaginatorEnd = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
};

export type PaginatorBlog = PaginatorEnd & {
    items: Array<BlogViewModel>;
};

export type PaginatorPost = PaginatorEnd & {
    items: Array<PostViewModel>;
};

export type PaginatorUser = PaginatorEnd & {
    items: Array<UserViewModel>;
};

export type PaginatorCommentViewModel = PaginatorEnd & {
    items: Array<CommentViewModel>;
};

export type PaginatorCommentWithLikeViewModel = PaginatorEnd & {
    items: Array<CommentWithLikeViewModel>

};
