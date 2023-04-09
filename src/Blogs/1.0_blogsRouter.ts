import {Router} from "express";
import {basicValidationMiddleware} from "../middlewares/basicMiddleware";
import {
    contentValidation,
    descriptionValidation,
    inputValidationMiddleware,
    nameValidation,
    shortDescriptionValidation,
    titleValidation,
    websiteUrlValidation,
} from "../middlewares/inputValidationMiddleware";
import {container} from "../composition-root";
import {BlogsController} from "./1.1_blogsController";

const blogsController = container.resolve(BlogsController)

export const blogsRouter = Router({});


//GET
blogsRouter.get("/", blogsController.getBlogs.bind(blogsController))

//GET BY ID
blogsRouter.get("/:id", blogsController.getBlog.bind(blogsController))

//POST
blogsRouter.post(
    "/",
    basicValidationMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    blogsController.createBlog.bind(blogsController))

//PUT
blogsRouter.put(
    "/:id",
    basicValidationMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    blogsController.updateBlog.bind(blogsController))

//DELETE
blogsRouter.delete(
    "/:id",
    basicValidationMiddleware,
    blogsController.deleteBlog.bind(blogsController))


//POST POST BLOG ID
blogsRouter.post(
    "/:blogId/posts",
    basicValidationMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationMiddleware,
    blogsController.createPostByBlogId.bind(blogsController))


//GET POST BLOG ID
blogsRouter.get("/:blogId/posts", blogsController.getPostsByBlogId.bind(blogsController))
