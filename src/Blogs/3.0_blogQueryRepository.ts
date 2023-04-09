import {BlogModelClass, PostModelClass} from "../db";
import {BlogDBModel} from "./4_blogsType";
import {PostDBModel} from "../Posts/4_postsType";
import {injectable} from "inversify";

@injectable()
export class BlogsQRepository  {
    //GET
    async findBlogs(a: {
        filter: { name: { $regex: string; } } | {},
        filterSort: any,
        pageNumber: number,
        pageSize: number
    }) {

        const result: Array<BlogDBModel> = await BlogModelClass
            .find(a.filter)
            .sort(a.filterSort)
            .skip((a.pageNumber - 1) * a.pageSize)
            .limit(a.pageSize)
            .lean()

        return result;
    }

    //GET BY ID
    async findBlogById(id: string) {
        try {
            const result: BlogDBModel | null = await BlogModelClass
                .findById(id)
                .lean();
            return result;
        } catch (e) {
            return null
        }
    }

    //GET POST BLOG ID
    async findPostsByBlogId(a: { filter: { blogId: string }, filterSort: any, pageNumber: number, pageSize: number }) {

        const result: Array<PostDBModel> = await PostModelClass
            .find(a.filter)
            .sort(a.filterSort)
            .skip((a.pageNumber - 1) * a.pageSize)
            .limit(a.pageSize)
            .lean()

        return result;
    }
}