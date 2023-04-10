import {BlogsService} from "./2_blogsService";
import {Request, Response} from "express";
import {PaginatorBlog, PaginatorPost, PaginatorStart} from "../Paginator/paginatorType";
import {paginator} from "../Paginator/paginator";
import {BlogViewModel} from "./4_blogsType";
import {PostViewModel} from "../Posts/4_postsType";
import {inject, injectable} from "inversify";
import {TYPES} from "../iocTYPES";
import { getUserIdFromAccessToken } from "../functions";

@injectable()
export class BlogsController {
    constructor(@inject(TYPES.BlogsService) protected blogsService: BlogsService) {
    }

    async getBlogs(req: Request, res: Response) {
        const paginatorInfo: PaginatorStart = paginator(req.query);

        const blogs: PaginatorBlog = await this.blogsService.findBlogs(paginatorInfo)

        res.status(200).send(blogs);
    }

    async getBlog(req: Request, res: Response) {
        const blog: BlogViewModel | null = await this.blogsService.findBlogById(req.params.id);

        blog ? res.status(200).send(blog) : res.sendStatus(404)
    }

    async createBlog(req: Request, res: Response) {
        const blog: BlogViewModel = await this.blogsService.createBlog({
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        });
        res.status(201).send(blog);
    }

    async updateBlog(req: Request, res: Response) {
        const blogPut: boolean = await this.blogsService.updateBlog({
            id: req.params.id,
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        });
        blogPut ? res.sendStatus(204) : res.sendStatus(404);
    }

    async deleteBlog(req: Request, res: Response) {
        const blogDelete: boolean = await this.blogsService.deleteBlog(req.params.id);
        blogDelete ? res.sendStatus(204) : res.sendStatus(404);
    }

    async createPostByBlogId(req: Request, res: Response) {
        const isBlog: BlogViewModel | null = await this.blogsService.findBlogById(req.params.blogId);

        if (isBlog) {
            const userId = await getUserIdFromAccessToken(req.headers.authorization)
            const post: PostViewModel =
                await this.blogsService.postPostByBlogId({
                    blogID: isBlog.id, blogName: isBlog.name,
                    title: req.body.title,
                    shortDescription: req.body.shortDescription,
                    content: req.body.content,
                    userId:userId
                });
            res.status(201).send(post);
        } else {
            res.sendStatus(404);
        }
    }

    async getPostsByBlogId(req: Request, res: Response) {

        const paginatorInformation: PaginatorStart = paginator(req.query);

        const userId = await getUserIdFromAccessToken(req.headers.authorization)

        const blogGetById: BlogViewModel | null = await this.blogsService.findBlogById(req.params.blogId);

        if (blogGetById) {
            const posts: PaginatorPost = await this.blogsService.findPostsByBlogId({
                paginator: paginatorInformation,
                blogId: blogGetById.id,
                userId:userId
            });
            res.status(200).send(posts);
        } else {
            res.sendStatus(404);
        }
    }
}