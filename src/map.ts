
import { BlogDBModel, BlogViewModel } from "./Blogs/4_blogsType";
import { PostDBModel, PostViewModel, PostWithLikeViewModel } from "./Posts/4_postsType";
import { CommentDBModel, CommentViewModel, CommentWithLikeViewModel } from "./Comments/4_commentsType";
import { UserDBModel, UserViewModel } from "./Users/4_userType";
import { SecurityDevicesDBModel, SecurityDevicesViewModel } from "./SecurityDevices/4_securityDevicesType";

//---------


export function mapBlog(blog: BlogDBModel) {
    const result: BlogViewModel = {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt.toISOString(),
        isMembership: blog.isMembership,
    };
    return result;
}

export function mapPost(post: PostDBModel) {
    const result: PostViewModel = {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt.toISOString(),
    };
    return result;
}


export function mapPostWithLike(a: { post: PostDBModel; id: string; }) {
    let likeArr = a.post.extendedLikesInfo.likesCount.filter(m=>m?.userId===a.id).length;
    let dislikeArr =  a.post.extendedLikesInfo.dislikesCount.filter(m=>m?.userId===a.id).length;

    
    let status = "";
    if (likeArr === dislikeArr) {
        status = "None";
    } else if (likeArr > dislikeArr) {
        status = "Like";
    } else {
        status = "Dislike";
    }

    const result: PostWithLikeViewModel = {
        id: a.post._id.toString(),
        title: a.post.title,
        shortDescription: a.post.shortDescription,
        content: a.post.content,
        blogId: a.post.blogId,
        blogName: a.post.blogName,
        createdAt: a.post.createdAt.toISOString(),
        extendedLikesInfo: {
            likesCount: a.post.extendedLikesInfo.likesCount.length,
            dislikesCount: a.post.extendedLikesInfo.dislikesCount.length,
            myStatus: status,
            newestLikes: a.post.extendedLikesInfo.likesCount.splice(-3).reverse()
        }
    };
    return result;
}

export function mapComment(comment: CommentDBModel) {
    const result: CommentViewModel = {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin,
        },
        createdAt: comment.createdAt.toISOString()
    };
    return result;

}

export function mapCommentWithLike(a: { comment: CommentDBModel; id: string; }) {
    let likeArr = a.comment.likesInfo.likesCount.indexOf(a.id);
    let dislikeArr = a.comment.likesInfo.dislikesCount.indexOf(a.id);

    let status = "";
    if (likeArr === dislikeArr) {
        status = "None";
    } else if (likeArr > dislikeArr) {
        status = "Like";
    } else {
        status = "Dislike";
    }

    const result: CommentWithLikeViewModel = {
        id: a.comment._id.toString(),
        content: a.comment.content,
        commentatorInfo: {
            userId: a.comment.commentatorInfo.userId,
            userLogin: a.comment.commentatorInfo.userLogin,
        },
        createdAt: a.comment.createdAt.toISOString(),
        likesInfo: {
            likesCount: a.comment.likesInfo.likesCount.length,
            dislikesCount: a.comment.likesInfo.dislikesCount.length,
            myStatus: status,
        }
    };
    return result;
}

export function mapUser(user: UserDBModel) {
    const result: UserViewModel = {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
    };
    return result;
}

export function mapSecurityDevices(securityDevice: SecurityDevicesDBModel) {
    const result: SecurityDevicesViewModel = {
        ip: securityDevice.ip,
        title: securityDevice.title,
        lastActiveDate: securityDevice.lastActiveDate,
        deviceId: securityDevice.deviceId,
    };
    return result;
}
