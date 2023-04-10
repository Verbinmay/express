import {
    CommentModelClass,
    PostModelClass,
} from "../db";
import {PostDBModel} from "./4_postsType";
import {CommentDBModel} from "../Comments/4_commentsType";
import {injectable} from "inversify";

@injectable()
export class PostsRepository {

    //POST
    async createPost(post: any) {
        const result: PostDBModel = await PostModelClass.create(post).then(doc => doc.toObject())
        return result;
    }

    //PUT
    async updatePost(a: {
        id: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
        blogName: string
    }) {
        try {
            const result = await PostModelClass.findById(a.id)
            if (!result) return false

            result.title = a.title
            result.shortDescription = a.shortDescription
            result.content = a.content
            result.blogId = a.blogId
            result.blogName = a.blogName

            result.save()

            return true;
        } catch (e) {
            return false
        }
    }

    //DELETE
    async deletePost(id: string) {
        try {
            const result = await PostModelClass.findById(id)

            if (!result) return false

            await result.deleteOne()

            return true
        } catch (e) {
            return false
        }
    }

    //POST COMMENTS BY POST ID
    async createCommentsByPostId(comment: any) {

        const result: CommentDBModel = await CommentModelClass.create(comment).then(doc => doc.toObject());

        return result;
    }

     //UPDATE LIKE STATUS
     async updatePostLikeStatus(a: { postId: string, likeStatus: string, likeInfo: any}) {
        try {
            const result = await PostModelClass.findById(a.postId)

            if (!result) return false


            let likeArr = 0
            let dislikeArr = 0

            switch (a.likeStatus) {
                case "None":
                    likeArr = result.extendedLikesInfo.likesCount.findIndex(a.likeInfo);
                    if (likeArr > -1) {
                        result.extendedLikesInfo.likesCount.splice(likeArr, 1);
                    }

                    dislikeArr = result.extendedLikesInfo.dislikesCount.findIndex(a.likeInfo);
                    if (dislikeArr > -1) {
                        result.extendedLikesInfo.dislikesCount.splice(dislikeArr, 1);
                    }

                    break;
                case"Like":
                    dislikeArr = result.extendedLikesInfo.dislikesCount.findIndex(a.likeInfo);
                    if (dislikeArr > -1) {
                        result.extendedLikesInfo.dislikesCount.splice(dislikeArr, 1);
                    }
                    likeArr = result.extendedLikesInfo.likesCount.findIndex(a.likeInfo);
                    if (likeArr <= -1) {
                        result.extendedLikesInfo.likesCount.push(a.likeInfo);
                    }

                    break;
                case"Dislike":
                    likeArr = result.extendedLikesInfo.likesCount.findIndex(a.likeInfo);
                    if (likeArr > -1) {
                        result.extendedLikesInfo.likesCount.splice(likeArr, 1);
                    }
                    dislikeArr = result.extendedLikesInfo.dislikesCount.findIndex(a.likeInfo);
                    if (dislikeArr <= -1) {
                        result.extendedLikesInfo.dislikesCount.push(a.likeInfo);
                    }
                    break;
            }

            result.save()

            return true
        } catch (e) {
            return false
        }
    }
}
