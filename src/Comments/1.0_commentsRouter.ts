import {Router} from "express";
import {AccessTokenMiddleware} from "../middlewares/authMiddleware";
import {
    contentCommentCreateValidation,
    inputValidationMiddleware,
    likeStatusValidation,
} from "../middlewares/inputValidationMiddleware";
import { container} from "../composition-root";
import {CommentsController} from "./1.1_commentsController";


const commentsController = container.resolve(CommentsController)

export const commentsRouter = Router({});


//GET
commentsRouter.get("/:id", commentsController.getComment.bind(commentsController));

//PUT
commentsRouter.put(
    "/:commentId",
    AccessTokenMiddleware,
    contentCommentCreateValidation,
    inputValidationMiddleware,
    commentsController.updateComment.bind(commentsController))
;

//PUT LIKESTATUS
commentsRouter.put(
    "/:commentId/like-status",
    AccessTokenMiddleware,
    likeStatusValidation,
    inputValidationMiddleware,
    commentsController.updateLikeStatus.bind(commentsController))
;

//DELETE
commentsRouter.delete(
    "/:commentId",
    AccessTokenMiddleware,
    commentsController.deleteComment.bind(commentsController))
;
