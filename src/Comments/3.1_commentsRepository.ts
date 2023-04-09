import {CommentModelClass} from "../db";
import { mapUser } from "../map";
import {injectable} from "inversify";

@injectable()

export class CommentsRepository {
    //POST
    async updateComment(a: { commentId: string, content: string }) {
        try {
            const result = await CommentModelClass.findById(a.commentId)

            if (!result) return false
            result.content = a.content
            result.save()

            return true
        } catch (e) {
            return false
        }
    }

    //DELETE
    async deleteComment(commentId: string) {
        try {
            const result = await CommentModelClass.findByIdAndDelete(commentId);
            return true
        } catch (e) {
            return false
        }
    }

    //UPDATE LIKE STATUS
    async updateCommentLikeStatus(a: { commentId: string, likeStatus: string, userId: string }) {
        try {
            const result = await CommentModelClass.findById(a.commentId)

            if (!result) return false


            let likeArr = 0
            let dislikeArr = 0

            switch (a.likeStatus) {
                case "None":
                    likeArr = result.likesInfo.likesCount.indexOf(a.userId);
                    if (likeArr > -1) {
                        result.likesInfo.likesCount.splice(likeArr, 1);
                    }

                    dislikeArr = result.likesInfo.dislikesCount.indexOf(a.userId);
                    if (dislikeArr > -1) {
                        result.likesInfo.dislikesCount.splice(dislikeArr, 1);
                    }

                    break;
                case"Like":
                    dislikeArr = result.likesInfo.dislikesCount.indexOf(a.userId);
                    if (dislikeArr > -1) {
                        result.likesInfo.dislikesCount.splice(dislikeArr, 1);
                    }
                    likeArr = result.likesInfo.likesCount.indexOf(a.userId);
                    if (likeArr <= -1) {
                        result.likesInfo.likesCount.push(a.userId);
                    }

                    break;
                case"Dislike":
                    likeArr = result.likesInfo.likesCount.indexOf(a.userId);
                    if (likeArr > -1) {
                        result.likesInfo.likesCount.splice(likeArr, 1);
                    }
                    dislikeArr = result.likesInfo.dislikesCount.indexOf(a.userId);
                    if (dislikeArr <= -1) {
                        result.likesInfo.dislikesCount.push(a.userId);
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
