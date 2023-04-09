import {Router} from "express";
import {AccessTokenMiddleware} from "../middlewares/authMiddleware";
import {basicValidationMiddleware} from "../middlewares/basicMiddleware";
import {
    contentCommentCreateValidation,
    contentValidation,
    inputValidationMiddleware,
    isBlogIdValidation,
    shortDescriptionValidation,
    titleValidation,
} from "../middlewares/inputValidationMiddleware";

import {container} from "../composition-root";
import {CommentsController} from "../Comments/1.1_commentsController";
import {PostsController} from "./1.1_postsController";

const postsController = container.resolve(PostsController)

export const postsRouter = Router({});

//GET
postsRouter.get("/", postsController.getPosts.bind(postsController));

//GET BY ID
postsRouter.get("/:id", postsController.getPost.bind(postsController))

//POST
postsRouter.post(
    "/",
    basicValidationMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    isBlogIdValidation,
    inputValidationMiddleware,
    postsController.createPost.bind(postsController))

//PUT

postsRouter.put(
    "/:id",
    basicValidationMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    isBlogIdValidation,
    inputValidationMiddleware,
    postsController.updatePost.bind(postsController))

//DELETE
postsRouter.delete(
    "/:id",
    basicValidationMiddleware,
    postsController.deletePost.bind(postsController))


//POST COMMENTS BY POST ID
postsRouter.post(
    "/:postId/comments",
    AccessTokenMiddleware,
    contentCommentCreateValidation,
    inputValidationMiddleware,
    postsController.createCommentByPostId.bind(postsController))

//GET COMMENTS BY POST ID
postsRouter.get("/:postId/comments", postsController.getCommentsByPostId.bind(postsController))
