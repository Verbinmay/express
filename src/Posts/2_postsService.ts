import {
    PaginatorCommentViewModel,
    PaginatorCommentWithLikeViewModel,
    PaginatorPost,
    PaginatorStart
} from "../Paginator/paginatorType";
import {countTotalAndPages, createFilterSort} from "../Paginator/paginator";
import {CommentModelClass, PostModelClass} from "../db";
import {PostDBModel, PostViewModel} from "./4_postsType";
import {mapComment, mapCommentWithLike, mapPost} from "../functions";
import {BlogViewModel} from "../Blogs/4_blogsType";
import {CommentDBModel, CommentViewModel, CommentWithLikeViewModel} from "../Comments/4_commentsType";
import {UserDBModel, UserViewModel} from "../Users/4_userType";
import {PostsQRepository} from "./3.0_postsQueryRepository";
import {PostsRepository} from "./3.1_postsRepository";
import {UsersQRepository} from "../Users/3.0_usersQueryRepository";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";
import {TYPES} from "../iocTYPES";

@injectable()
export class PostsService {

    constructor(
        @inject(TYPES.PostsRepository)protected postsRepository: PostsRepository,
        @inject(TYPES.PostsQRepository) protected postsQRepository: PostsQRepository,
        @inject(TYPES.UsersQRepository) protected usersQRepository: UsersQRepository
    ) {

    }

    //GET
    async findPosts(paginator: PaginatorStart) {
        const filter: {} = {};
        const filterSort: any = createFilterSort({
            sortBy: paginator.sortBy,
            sortDirection: paginator.sortDirection
        });
        const pagesCounter: { pagesCount: number; totalCount: number } =
            await countTotalAndPages({
                modelClass: PostModelClass,
                filter: filter,
                pageSize: paginator.pageSize
            });

        const postsFromDB: PostDBModel[] = await this.postsQRepository.findPosts({
            filter: filter,
            filterSort: filterSort,
            pageNumber: paginator.pageNumber,
            pageSize: paginator.pageSize
        })

        const posts: PostViewModel[] = postsFromDB.map(m => {
            return mapPost(m)
        })

        const result: PaginatorPost = {
            pagesCount: pagesCounter.pagesCount,
            page: paginator.pageNumber,
            pageSize: paginator.pageSize,
            totalCount: pagesCounter.totalCount,
            items: posts
        };

        return result
    }

    //GET BY ID
    async findPostById(id: string) {
        const postFromDB: PostDBModel | null = await this.postsQRepository.findPostById(id)
        return postFromDB ? mapPost(postFromDB) : null
    }


    //POST
    async createPost(a: {
        title: string,
        shortDescription: string,
        content: string,
        blog: BlogViewModel
    }) {
        const post = new PostDBModel(
            new ObjectId(),
            a.title,
            a.shortDescription,
            a.content,
            a.blog.id,
            a.blog.name,
            new Date(),
            new Date(),
        )
        const postInDB: PostDBModel = await this.postsRepository.createPost(post);

        return mapPost(postInDB);
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
        return await this.postsRepository.updatePost(a);
    }

    //DELETE
    async deletePost(id: string) {
        return await this.postsRepository.deletePost(id);
    }

    //POST COMMENTS BY POST ID
    async createCommentsByPostId(a: {
        content: string,
        userId: string,
        postId: string
    }) {
        const user: UserDBModel | null = await this.usersQRepository.findUserById(a.userId);

        const comment = new CommentDBModel(
            new ObjectId(),
            a.content,
            {
                userId: a.userId,
                userLogin: user!.login,
            },
            new Date(),
            new Date(),
            a.postId,
            {
                likesCount: [],
                dislikesCount: [],
                myStatus: "default"
            }
        )
        {
        }


        const commentInDB: CommentDBModel = await this.postsRepository.createCommentsByPostId(comment);

        return mapCommentWithLike({comment:commentInDB, id: a.userId});
    }

    //GET COMMENTS BY POST ID
    async getCommentsByPostId(a: {
        paginator: PaginatorStart,
        postId: string,
        userId:string
    }) {
        const filter: { postId: string } = {postId: a.postId};

        const filterSort: any = createFilterSort({
            sortBy: a.paginator.sortBy,
            sortDirection: a.paginator.sortDirection
        });

        const pagesCounter: { pagesCount: number; totalCount: number } =
            await countTotalAndPages({
                    modelClass: CommentModelClass,
                    filter: filter,
                    pageSize: a.paginator.pageSize
                }
            );

        const commentsFromDb: CommentDBModel[] = await this.postsQRepository.getCommentsByPostId({
            filter: filter,
            filterSort: filterSort,
            pageNumber: a.paginator.pageNumber,
            pageSize: a.paginator.pageSize
        })

        const comments: CommentWithLikeViewModel[] = commentsFromDb.map(m => {
            return mapCommentWithLike({comment:m, id:a.userId})
        })

        const result: PaginatorCommentWithLikeViewModel = {

            pagesCount: pagesCounter.pagesCount,
            page: a.paginator.pageNumber,
            pageSize: a.paginator.pageSize,
            totalCount: pagesCounter.totalCount,
            items: comments
        };

        return result

    }
}
