import {CommentsService} from "./2_commentsService";
import { Request, Response} from "express";
import {CommentViewModel, CommentWithLikeViewModel} from "./4_commentsType";
import {getUserIdFromAccessToken} from "../functions";
import {inject, injectable} from "inversify";
import {TYPES} from "../iocTYPES";
@injectable()
export class CommentsController {
    constructor(
        @inject(TYPES.CommentsService)protected commentsService: CommentsService
    ) {
    }

    async getComment(req: Request, res: Response) {

        const userId = await getUserIdFromAccessToken(req.headers.authorization)

        const comment: CommentWithLikeViewModel | null =
            await this.commentsService.findCommentById({commentId: req.params.id, userId: userId});

        comment ?
            res.status(200).send(comment) :
            res.send(404);
    }

    async updateComment(req: Request, res: Response) {
        const commentFind: CommentViewModel | null =
            await this.commentsService.findCommentById({commentId: req.params.commentId, userId: ""});
        if (!commentFind) {
            res.sendStatus(404)
            return
        }

        if (commentFind.commentatorInfo.userId !== req.user.userId) {
            res.send(403);
            return
        }

        const commentUpdate: boolean = await this.commentsService.updateComment({
            commentId: req.params.commentId,
            content: req.body.content
        });

        commentUpdate ?
            res.sendStatus(204) : res.sendStatus(404)

    }

    async deleteComment(req: Request, res: Response) {
        const commentFind: CommentViewModel | null =
            await this.commentsService.findCommentById({commentId: req.params.commentId, userId: ""});

        if (!commentFind) {
            res.sendStatus(404);
            return
        }

        if (commentFind.commentatorInfo.userId !== req.user.userId) {
            res.sendStatus(403)
            return
        }

        const commentDelete: boolean = await this.commentsService.deleteComment(commentFind.id);
        commentDelete ?
            res.sendStatus(204) : res.sendStatus(404);

    }

    async updateLikeStatus(req: Request, res: Response) {

        const commentFind: CommentViewModel | null =
            await this.commentsService.findCommentById({commentId: req.params.commentId, userId: ""});
        if (!commentFind) {
            res.sendStatus(404)
            return
        }

        const commentUpdateLikeStatus: boolean = await this.commentsService.updateCommentLikeStatus({
            commentId: req.params.commentId,
            likeStatus: req.body.likeStatus,
            userId: req.user.userId
        });

        commentUpdateLikeStatus ?
            res.sendStatus(204) : res.sendStatus(404)

    }

}