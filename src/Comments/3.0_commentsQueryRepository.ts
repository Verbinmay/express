import {CommentModelClass} from "../db";
import {CommentDBModel} from "./4_commentsType";
import {injectable} from "inversify";

@injectable()

export class CommentsQRepository {
    //GET BY ID
    async findCommentById(id: string) {

        try {
            const result: CommentDBModel | null = await CommentModelClass.findById(id).lean()
            return result;
        } catch (e) {
            return null
        }


    }


}