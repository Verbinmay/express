import {CommentModelClass, PostModelClass} from "../db";
import {PostDBModel} from "./4_postsType";
import {CommentDBModel} from "../Comments/4_commentsType";
import {injectable} from "inversify";

@injectable()
export class PostsQRepository {
    //GET
    async findPosts(a: {
        filter: {},
        filterSort: any,
        pageNumber: number,
        pageSize: number
    }) {
        const result: Array<PostDBModel> = await PostModelClass
            .find(a.filter)
            .sort(a.filterSort)
            .skip((a.pageNumber - 1) * a.pageSize)
            .limit(a.pageSize)
            .lean()

        return result;
    }

    async findPostById(id: string) {
        try {
            const result: PostDBModel | null = await PostModelClass
                .findById(id)
                .lean();
            return result;
        } catch (e) {
            return null
        }
    }

    //GET COMMENTS BY POST ID
    async getCommentsByPostId(a: {
        filter: {},
        filterSort: any,
        pageNumber: number,
        pageSize: number
    }) {
        const result: Array<CommentDBModel> = await CommentModelClass
            .find(a.filter)
            .sort(a.filterSort)
            .skip((a.pageNumber - 1) * a.pageSize)
            .limit(a.pageSize)
            .lean()

        return result;
    }
}