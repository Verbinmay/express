import "reflect-metadata";
import { BlogModelClass, PostModelClass } from "../db";
import { BlogDBModel } from "./4_blogsType";
import { PostDBModel } from "../Posts/4_postsType";
import { injectable } from "inversify";

@injectable()
export class BlogsRepository {
  //POST
  async createBlog(blog: any) {
    const result: BlogDBModel = await BlogModelClass.create(blog).then((doc) =>
      doc.toObject()
    );
    return result;
  }
  //UPDATE
  async updateBlog(a: {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
  }) {
    try {
      const result = await BlogModelClass.findById(a.id);

      if (!result) return false;

      result.name = a.name;
      result.description = a.description;
      result.websiteUrl = a.websiteUrl;

      await result.save();

      await PostModelClass.updateMany({ blogId: a.id }, { blogName: a.name });

      return true;
    } catch (e) {
      return false;
    }
  }

  //DELETE
  async deleteBlog(id: string) {
    try {
      const result = await BlogModelClass.findByIdAndDelete(id);
      return true;
    } catch (e) {
      return false;
    }
  }

  //POST POST BLOG ID
  async postPostByBlogId(createdPost: any) {
    const result: PostDBModel = await PostModelClass.create(createdPost).then(
      (doc) => doc.toObject()
    );
    return result;
  }
}
