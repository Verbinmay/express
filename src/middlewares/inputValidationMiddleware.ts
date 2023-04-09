import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { BlogsService } from "../Blogs/2_blogsService";
import { BlogViewModel} from "../Blogs/4_blogsType";
import { container} from "../composition-root";

const blogsService = container.resolve(BlogsService)


//Blogs
export const nameValidation = body("name")
  .isString()
  .withMessage("Not name")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("Name is empty")
  .bail()
  .isLength({ max: 15 })
  .withMessage("Names length must be max 15");
export const descriptionValidation = body("description")
  .isString()
  .withMessage("Is not string")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("Description is empty")
  .bail()
  .isLength({ max: 500 })
  .withMessage("Description length must be max 500");
export const websiteUrlValidation = body("websiteUrl")
  .isURL()
  .withMessage("Is not URL")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("WebsiteURL is empty")
  .bail()
  .isLength({ max: 100 })
  .withMessage("WebsiteUrl length must be max 100");
//POST

export const titleValidation = body("title")
  .isString()
  .withMessage("Title is not string")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("Title is empty")
  .bail()
  .isLength({ max: 30 })
  .withMessage("Title length must be max 30");

export const shortDescriptionValidation = body("shortDescription")
  .isString()
  .withMessage("ShortDescription is not string")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("ShortDescription is empty")
  .bail()
  .isLength({ max: 100 })
  .withMessage("shortDescription length must be max 100");
export const contentValidation = body("content")
  .isString()
  .withMessage("content Is not string")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("content is empty")
  .bail()
  .isLength({ max: 1000 })
  .withMessage("content length must be max 1000");

//POST BLOG VALID
export const isBlogIdValidation = body("blogId").custom(async (value,{req}) => {
  let result:BlogViewModel|null = await blogsService.findBlogById(value)
  if (result) {
    req.blog = result;
  }
  if (result == null) {
    throw new Error("Please insert existed user id");
  }
  return true;
});

// Comments
export const contentCommentCreateValidation = body("content")
  .isString()
  .withMessage("Is not string")
  .bail()
  .isLength({ min: 20, max: 300 })
  .withMessage("content length must be min 20, max 300");

export const likeStatusValidation = body("likeStatus")
    .isIn(["None", "Like", "Dislike" ])
    .withMessage("likeStatus is None, Like or Dislike")

// AUTH 
export const loginOrEmailValidation = body("loginOrEmail")
  .isString()
  .withMessage("loginOrEmail Is not string")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("loginOrEmail is empty");
//Auth
export const passwordValidation = body("password")
  .isString()
  .withMessage("password Is not string")
  .bail()
  .trim()
  .notEmpty()
  .withMessage("password is empty");

  // USER 

export const loginCreateValidation = body("login")
  .isString()
  .withMessage("Is not string")
  .bail()
  .isLength({ min: 3, max: 10 })
  .withMessage("login length must be min 3, max 10");
//
export const passwordCreateValidation = body("password")
  .isString()
  .withMessage("Is not string")
  .bail()
  .isLength({ min: 6, max: 20 })
  .withMessage("login length must be min 6, max 20");

export const emailCreateValidation = body("email")
  .isEmail()
  .withMessage("Is not email");




//auth
export const newPasswordValidation = body("newPassword")
    .isString()
    .withMessage("Is not string")
    .bail()
    .isLength({ min: 6, max: 20 })
    .withMessage("login length must be min 6, max 20");

// Validation
export const inputValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let newErrorsArray = errors.array().map(function (a) {
      return {
        message: a.msg,
        field: a.param,
      };
    });
    res.status(400).json({ errorsMessages: newErrorsArray });
  } else {
    next();
  }
};



////////////////////////////////////
// export async function isBlogIdValidationInPath(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   let result = await blogsRepository.findBlogById(req.params.id);
//   if (result === null) {
//     return res.send(404);
//   } else {
//     return next();
//   }
// }

// export const isBlogIdValidation = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   let result:BlogDBModel|null = await blogsCollections.findOne({ id: req.body.blogId });
//   if (result) {
//     req.blog = result;
//     next();
//   } else {
//     throw new Error("Please insert existed user id");
//   }
//   return true;
// };