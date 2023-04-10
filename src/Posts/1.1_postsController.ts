import {PostsService} from "./2_postsService";
import {Request, Response} from "express";
import {paginator} from "../Paginator/paginator";
import {PaginatorCommentViewModel, PaginatorPost, PaginatorStart} from "../Paginator/paginatorType";
import {PostViewModel, PostWithLikeViewModel} from "./4_postsType";
import {CommentViewModel} from "../Comments/4_commentsType";
import {getUserIdFromAccessToken} from "../functions";
import {inject, injectable} from "inversify";
import {TYPES} from "../iocTYPES";

@injectable()
export class PostsController {
   constructor(@inject(TYPES.PostsService)protected postsService: PostsService) {
    }

    async getPosts(req: Request, res: Response) {
        const paginatorInformation = paginator(req.query);
        const userId = await getUserIdFromAccessToken(req.headers.authorization)
        const postsGet: PaginatorPost = await this.postsService.findPosts(paginatorInformation,userId);

        res.status(200).send(postsGet);
    }

    async getPost(req: Request, res: Response) {
        const userId = await getUserIdFromAccessToken(req.headers.authorization)
        const postGetById: PostViewModel | null = await this.postsService.findPostById(req.params.id,userId);

        if (postGetById) {
            res.status(200).send(postGetById);
        } else {
            res.sendStatus(404);
        }
    }

    async createPost(req: Request, res: Response) {
        const userId = await getUserIdFromAccessToken(req.headers.authorization)
        const post: PostViewModel = await this.postsService.createPost({
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blog: req.blog,
            userId:userId
        });
        res.status(201).send(post);
    }

    async updatePost(req: Request, res: Response) {
        const postUpdate: boolean = await this.postsService.updatePost({
            id: req.params.id,
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.blog.id,
            blogName: req.blog.name,
        });

        postUpdate ?
            res.sendStatus(204) : res.sendStatus(404);
    }

    async deletePost(req: Request, res: Response) {
        const postDelete: boolean = await this.postsService.deletePost(req.params.id);

        postDelete ?
            res.sendStatus(204) : res.sendStatus(404);
    }

    async createCommentByPostId(req: Request, res: Response) {
        const userId = await getUserIdFromAccessToken(req.headers.authorization)
        const post: PostViewModel | null = await this.postsService.findPostById(req.params.postId,userId);

        if (!post) {
            res.sendStatus(404);
            return
        }

        const comment: CommentViewModel = await this.postsService.createCommentsByPostId({
            content: req.body.content,
            userId: req.user.userId,
            postId: post.id
        });

        res.status(201).send(comment);
    }

    async getCommentsByPostId(req: Request, res: Response) {
        const userId = await getUserIdFromAccessToken(req.headers.authorization)
        const post: PostViewModel | null = await this.postsService.findPostById(req.params.postId,userId);

        if (!post) {
            res.sendStatus(404);
            return
        }
       

        const paginatorInformation: PaginatorStart = paginator(req.query);

        const comments: PaginatorCommentViewModel = await this.postsService.getCommentsByPostId(
            {
                paginator: paginatorInformation,
                postId: post.id,
                userId: userId
            }
        );

        res.status(200).send(comments);
    }

    async updateLikeStatus(req: Request, res: Response) {

        const postFind: PostWithLikeViewModel | null =
            await this.postsService.findPostById( req.params.postId, req.user.id);
        if (!postFind) {
            console.log("postFind")
            res.sendStatus(404)
            return
        }
        if( postFind.extendedLikesInfo.myStatus === req.body.likeStatus){
            res.sendStatus(204)
            return
        }

        const postUpdateLikeStatus: boolean = await this.postsService.updatePostLikeStatus({
            postId: req.params.postId,
            likeStatus: req.body.likeStatus,
            userId: req.user.userId
        });

        postUpdateLikeStatus ?
            res.sendStatus(204) : res.sendStatus(404)

    }


}