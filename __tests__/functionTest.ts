import {faker} from "@faker-js/faker";
// @ts-ignore
import {agent} from "./e2e/api.test";
import {BlogInputModel, BlogViewModel} from "../src/Blogs/4_blogsType";
import {blogsRouter} from "../src/Blogs/1.0_blogsRouter";
import {PostViewModel} from "../src/Posts/4_postsType";

export const info = {
    url: {
        blogs: "/blogs/",
        posts: "/posts/",
        comments: "/comments/",
        like: "/like-status/",
        users: "/users/",
        auth:
            {
                login: "/auth/login",
                logout: "/auth/logout",
                refreshToken: "/auth/refresh-token",
                me: "/auth/me",
                registration: "/auth/registration",
                registrationConfirmation: "/auth/registration-confirmation",
                emailResending: "/auth/registration-email-resending",

            },
        security: "/security/devices/",
        testingDelete: "/testing/all-data"
    },
    headers: {
        authorization: "Basic YWRtaW46cXdlcnR5"
    }
}

//BLOG
export function testInputInfoBlog() {
    return {
        name: faker.word.noun(6),
        description: faker.lorem.sentence(6),
        websiteUrl: faker.internet.url()
    }
}

export async function testCreateBlogs(number: number) {

    let blogs:any = []
    for (let i = 0; i < number; i++) {
        const createdBlog = {
            name: faker.word.noun(6),
            description: faker.lorem.sentence(6),
            websiteUrl: faker.internet.url()
        }

        const result = await agent
            .post(info.url.blogs)
            .set("Authorization", info.headers.authorization)
            .send(createdBlog)
            .expect(201)
        blogs.push(result.body)
    }

    return blogs
}

//POST
export function testInputInfoPost() {
    return {
        title: faker.word.noun(6),
        shortDescription: faker.lorem.sentence(5),
        content: faker.lorem.sentences(5),
    }
}

export async function testCreatePosts(a: { number: number, blog: BlogViewModel }) {

    let posts:any = []
    for (let i = 0; i < a.number; i++) {
        const createdPost = {
            title: faker.word.noun(6),
            shortDescription: faker.lorem.sentence(5),
            content: faker.lorem.sentences(5),
            blogId: a.blog.id
        }

        const result = await agent
            .post(info.url.posts)
            .set("Authorization", info.headers.authorization)
            .send(createdPost)
            .expect(201)
        posts.push(result.body)
    }

    return posts
}

//USERS

export function testInputInfoUser() {
    return {
        login: faker.word.noun(6),
        password: faker.word.noun(8),
        email: faker.internet.email(),
    }
}

export async function testCreateUsers(number: number) {

    let users:any = []
    for (let i = 0; i < number; i++) {
        const createdPost = testInputInfoUser()

        const result = await agent
            .post(info.url.users)
            .set("Authorization", info.headers.authorization)
            .send(createdPost)
            .expect(201)
    if(result.body)
       { users.push(result.body)}
    }

    return users
}


//COMMENTS

export function testInputInfoComments() {
    return {
        content: faker.lorem.sentences(4),
    }
}

export async function testCreateComments(a: { number: number, post: PostViewModel }) {

    let comments:any = []
    for (let i = 0; i < a.number; i++) {
        const inputInfoUser = testInputInfoUser()
        const inputInfoComment = testInputInfoComments()

        const user = await agent
            .post(info.url.users)
            .set("Authorization", info.headers.authorization)
            .send(inputInfoUser)
            .expect(201)

        const login = await agent
            .post(info.url.auth.login)
            .send({
                loginOrEmail: inputInfoUser.email,
                password: inputInfoUser.password,
            })
            .expect(200);


        const comment = await agent
            .post(info.url.posts + a.post.id + info.url.comments)
            .send({...inputInfoComment, postId: a.post.id})
            .set("Authorization", "Bearer " + login.body.accessToken)
            .expect(201);


        comments.push(comment.body)
    }

    return comments
}

//