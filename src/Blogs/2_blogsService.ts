import {PaginatorBlog, PaginatorPost, PaginatorStart} from "../Paginator/paginatorType";
import {countTotalAndPages, createFilterSort} from "../Paginator/paginator";
import {BlogModelClass, PostModelClass} from "../db";
import {BlogDBModel, BlogViewModel} from "./4_blogsType";
import {PostDBModel, PostViewModel} from "../Posts/4_postsType";
import {BlogsRepository} from "./3.1_blogsRepository";
import {BlogsQRepository} from "./3.0_blogQueryRepository";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";
import {TYPES} from "../iocTYPES";
import { mapBlog, mapPost } from "../map";

@injectable()
export class BlogsService {

    constructor(
        @inject(TYPES.BlogsRepository)protected blogsRepository: BlogsRepository,
        @inject(TYPES.BlogsQRepository) protected blogsQRepository: BlogsQRepository
    ) {
    }

    //GET
    async findBlogs(paginator: PaginatorStart) {
        const filterName: { name: { $regex: string; } } | {} = paginator.searchNameTerm ? {name: {$regex: "(?i)" + paginator.searchNameTerm + "(?-i)"}} : {}

        const filterSort: { [x: string]: number } = createFilterSort({
            sortBy: paginator.sortBy,
            sortDirection: paginator.sortDirection
        });

        const pagesCounter: { pagesCount: number; totalCount: number } =
            await countTotalAndPages({
                modelClass: BlogModelClass,
                filter: filterName,
                pageSize: paginator.pageSize
            });

        const blogsFromDB: BlogDBModel[] = await this.blogsQRepository.findBlogs({
            filter: filterName,
            filterSort: filterSort,
            pageNumber: paginator.pageNumber,
            pageSize: paginator.pageSize
        })

        const blogs: BlogViewModel[] = blogsFromDB.map(m => {
            return mapBlog(m)
        })

        const result: PaginatorBlog = {
            pagesCount: pagesCounter.pagesCount,
            page: paginator.pageNumber,
            pageSize: paginator.pageSize,
            totalCount: pagesCounter.totalCount,
            items: blogs
        };

        return result

    }

    //GET BY ID
    async findBlogById(id: string) {
        const blog: BlogDBModel | null = await this.blogsQRepository.findBlogById(id)

        return blog ? mapBlog(blog) : null
    }

    //CREATE
    async createBlog(a: {
        name: string,
        description: string,
        websiteUrl: string
    }) {
        const blog = new BlogDBModel(
            new ObjectId(),
            a.name,
            a.description,
            a.websiteUrl,
            new Date(),
            new Date(),
            false
        )


        const result: BlogDBModel = await this.blogsRepository.createBlog(blog);

        return mapBlog(result);
    }


    //UPDATE
    async updateBlog(a: {
        id: string,
        name: string,
        description: string,
        websiteUrl: string
    }) {
        return await this.blogsRepository.updateBlog(a);
    }


    //DELETE
    async deleteBlog(id: string) {
        return await this.blogsRepository.deleteBlog(id);
    }


    //POST POST BLOG ID
    async postPostByBlogId(a: {
        blogID: string,
        blogName: string,
        title: string,
        shortDescription: string,
        content: string
    }) {
        const createdPost = new PostDBModel(
            new ObjectId(),
            a.title,
            a.shortDescription,
            a.content,
            a.blogID,
            a.blogName,
            new Date(),
            new Date(),
        )

        const result: PostDBModel = await this.blogsRepository.postPostByBlogId(createdPost);
        return mapPost(result);
    }


    //GET POST BLOG ID
    async findPostsByBlogId(a: { paginator: PaginatorStart, blogId: string }) {
        const filter: { blogId: string } = {blogId: a.blogId}

        const filterSort: { [x: string]: number } = createFilterSort({
            sortBy: a.paginator.sortBy,
            sortDirection: a.paginator.sortDirection
        });

        const pagesCounter: { pagesCount: number; totalCount: number } = await countTotalAndPages({
            modelClass: PostModelClass,
            filter: filter,
            pageSize: a.paginator.pageSize
        });

        const postsFromDB: PostDBModel[] = await this.blogsQRepository.findPostsByBlogId({
            filter: filter,
            filterSort: filterSort,
            pageNumber: a.paginator.pageNumber,
            pageSize: a.paginator.pageSize
        })

        const posts: PostViewModel[] = postsFromDB.map(m => {
            return mapPost(m)
        })

        const result: PaginatorPost = {
            pagesCount: pagesCounter.pagesCount,
            page: a.paginator.pageNumber,
            pageSize: a.paginator.pageSize,
            totalCount: pagesCounter.totalCount,
            items: posts
        };

        return result

    }
}
