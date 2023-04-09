import {BlogDBModel} from "../Blogs/4_blogsType";
import {UserDBModel} from "../Users/4_userType";
import {ObjectId} from "mongodb";


declare global {
  declare namespace Express {
    export interface Request {
      user: ObjectId<UserDBModel> | null;
      blog: ObjectId<BlogDBModel> | null;
    }
  }
}
