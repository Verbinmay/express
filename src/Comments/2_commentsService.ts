import { mapComment, mapCommentWithLike } from "../map";
import { CommentDBModel } from "./4_commentsType";
import { CommentsRepository } from "./3.1_commentsRepository";
import { CommentsQRepository } from "./3.0_commentsQueryRepository";
import { inject, injectable } from "inversify";
import { TYPES } from "../iocTYPES";

@injectable()
export class CommentsService {
  constructor(
    @inject(TYPES.CommentsRepository)
    protected commentsRepository: CommentsRepository,
    @inject(TYPES.CommentsQRepository)
    protected commentsQRepository: CommentsQRepository
  ) {}

  //GET
  async findCommentById(a: { commentId: string; userId: string }) {
    const commentFromDB: CommentDBModel | null =
      await this.commentsQRepository.findCommentById(a.commentId);

    if (!commentFromDB) return null;
    return mapCommentWithLike({ comment: commentFromDB, id: a.userId });
  }

  //POST
  async updateComment(a: { commentId: string; content: string }) {
    return await this.commentsRepository.updateComment(a);
  }

  //DELETE
  async deleteComment(commentId: string) {
    return await this.commentsRepository.deleteComment(commentId);
  }

  //UPDATE LIKE STATUS
  async updateCommentLikeStatus(a: {
    commentId: string;
    likeStatus: string;
    userId: string;
  }) {
    return await this.commentsRepository.updateCommentLikeStatus(a);
  }
}
