import supertest from "supertest";
import app from "../../src/index";
import {faker} from "@faker-js/faker"
import {
    info,
    testCreateBlogs, testCreateComments,
    testCreatePosts,
    testCreateUsers,
    testInputInfoBlog, testInputInfoComments,
    testInputInfoPost, testInputInfoUser
} from "../functionTest";
import {BlogInputModel} from "../../src/Blogs/4_blogsType";

export const agent = supertest.agent(app);

describe.skip("CREATORS ALL CHECK", () => {
    beforeAll(async () => {

        await agent.delete(info.url.testingDelete);
    }, 8000);

    it("POST|201-created blog", async () => {

        const blog = await testCreateBlogs(1)
        expect(blog).toHaveLength(1)
    });
})
//--------


describe("/blogs", () => {
    let blogs: any = []
    beforeAll(async () => {

        await agent.delete(info.url.testingDelete);
    }, 8000);

    it("GET|200- empty pagination`s blogs array", async () => {
        const paginatorBlogs = await agent.get(info.url.blogs).expect(200);

        expect(paginatorBlogs.body.items).toEqual([]);
    })

    it("POST|201-created blog", async () => {

        blogs = await testCreateBlogs(1)
        expect(blogs).toHaveLength(1)
    });

    it("GET|200 -pagination`s array with one ", async () => {

        const result = await agent
            .get(info.url.blogs + "/?searchNameTerm=" + blogs[0].name + "&sortBy=createdAt&sortDirection=desc&pageNumber=1&pageSize=10")
            .expect(200);

        expect(result.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: blogs,
        });
    });
    it("GET|200 - FIND BY ID", async () => {

        const result = await agent
            .get(info.url.blogs + blogs[0].id)
            .expect(200, blogs[0]);
    })

})
describe.skip("/blogs", () => {
    const createdBlog = {
        name: faker.word.noun(6),
        description: faker.lorem.sentence(6),
        websiteUrl: faker.internet.url()
    }

    beforeAll(async () => {

        await agent.delete(info.url.testingDelete);

    }, 8000);

    it("POST| 400 - name error", async () => {
        const blog = {...createdBlog, name: faker.random.alpha(16)}
        const result = await agent
            .post(info.url.blogs)
            .set("Authorization", info.headers.authorization)
            .send(blog)
            .expect(400);

        expect(result.body).toEqual({
            errorsMessages: expect.any(Array),
        });
    });

    it("POST| 400 - description error", async () => {
        const blog = {...createdBlog, description: faker.random.alpha(501)}

        const result = await agent
            .post(info.url.blogs)
            .set("Authorization", info.headers.authorization)
            .send(blog)
            .expect(400);

        expect(result.body).toEqual({
            errorsMessages: expect.any(Array),
        });
    });

    it("POST| 400 -  websiteUrl error", async () => {
        const blog = {...createdBlog, websiteUrl: faker.random.alpha(15)}

        const result = await agent
            .post(info.url.blogs)
            .set("Authorization", info.headers.authorization)
            .send(blog)
            .expect(400);

        expect(result.body).toEqual({
            errorsMessages: expect.any(Array),
        });
    });

    it("POST| 400 -  websiteUrl error", async () => {
        const blog = {...createdBlog, websiteUrl: faker.internet.url() + "/" + faker.random.alpha(100)}
        const result = await agent
            .post(info.url.blogs)
            .set("Authorization", info.headers.authorization)
            .send(blog)
            .expect(400);

        expect(result.body).toEqual({
            errorsMessages: expect.any(Array),
        });
    });
})
describe.skip("/blogs", () => {
    const InputInfoBlog = testInputInfoBlog()

    beforeAll(async () => {

        await agent.delete(info.url.testingDelete);

    }, 8000);

    it("POST| 401 - Unauthorized error", async () => {

        const result = await agent
            .post(info.url.blogs)
            .send(InputInfoBlog)
            .expect(401);
    });

    it("GET| 404 - FIND BY ID error", async () => {
        await agent
            .get(info.url.blogs + faker.random.numeric(6))
            .expect(404);
    });

})
describe.skip("/blogs", () => {
    let blogs: any = []
    const InputInfoBlog = testInputInfoBlog()
    beforeAll(async () => {

        await agent.delete(info.url.testingDelete);
        blogs = await testCreateBlogs(1)

    }, 8000);

    it("PUT| 204 - UPDATE BLOG BY ID", async () => {
        const updateBlog = await agent
            .put(info.url.blogs + blogs[0].id)
            .set("Authorization", info.headers.authorization)
            .send(InputInfoBlog)
            .expect(204);


        const findUpdateBlog = await agent
            .get(info.url.blogs + blogs[0].id)
            .expect(200);

        expect(InputInfoBlog.name).toBe(findUpdateBlog.body.name);
        expect(InputInfoBlog.description).toBe(findUpdateBlog.body.description);
        expect(InputInfoBlog.websiteUrl).toBe(findUpdateBlog.body.websiteUrl);
    });


    it("POST| 404 - UPDATE BLOG BY ID error", async () => {
        await agent
            .put(info.url.blogs + faker.random.numeric(6))
            .set("Authorization", info.headers.authorization)
            .send(InputInfoBlog)
            .expect(404);
    });


    it("POST| 401 - UPDATE BLOG BY ID error", async () => {

        await agent
            .put(info.url.blogs + blogs[0].id)
            .send(InputInfoBlog)
            .expect(401);
    });
})
describe.skip("/blogs", () => {
    let blogs: any = []

    const InputInfoBlog: BlogInputModel = testInputInfoBlog()
    beforeAll(async () => {

        await agent.delete(info.url.testingDelete);
        blogs = await testCreateBlogs(1)

    }, 8000);


    it("PUT| 400 - UPDATE BLOG name error", async () => {
        const result = await agent
            .put(info.url.blogs + blogs[0].id)
            .set("Authorization", info.headers.authorization)
            .send({...InputInfoBlog, name: faker.random.alpha(16)})
            .expect(400);
    })

    it("PUT| 400 - UPDATE BLOG description error", async () => {
        const result = await agent
            .put(info.url.blogs + blogs[0].id)
            .set("Authorization", info.headers.authorization)
            .send({...InputInfoBlog, description: faker.random.alpha(501)})
            .expect(400);
    });

    it("PUT| 400 - UPDATE BLOG websiteUrl error", async () => {
        const result = await agent
            .put(info.url.blogs + blogs[0].id)
            .set("Authorization", info.headers.authorization)
            .send({...InputInfoBlog, websiteUrl: faker.internet.url() + faker.random.alpha(100)})
            .expect(400);
    });
})
describe.skip("/blogs", () => {
    let blogs: any = []
    beforeAll(async () => {

        await agent.delete(info.url.testingDelete);
        blogs = await testCreateBlogs(1)

    }, 8000);


    it("DELETE|401  - DELETE BLOG access error", async () => {
        const result = await agent
            .delete(info.url.blogs + blogs[0].id)
            .expect(401);
    });

    it("DELETE|404  - DELETE BLOG  not found error", async () => {
        const result = await agent
            .delete(info.url.blogs + faker.random.numeric(6))
            .set("Authorization", info.headers.authorization)
            .expect(404);
    });


    it("DELETE|204  - DELETE BLOG", async () => {
        const result = await agent
            .delete(info.url.blogs + blogs[0].id)
            .set("Authorization", info.headers.authorization)
            .expect(204);

        await agent
            .get(info.url.blogs + blogs[0].id)
            .expect(404);
    });
})
describe.skip("/blogs", () => {
    let blogs: any = []
    const inputPostByIdInfo = testInputInfoPost()
    let post: any = {}
    beforeAll(async () => {

        await agent.delete(info.url.testingDelete);
        blogs = await testCreateBlogs(1)

    }, 8000);

    it(" POST|201 - POST BY BLOG ID", async () => {

        post = await agent
            .post(info.url.blogs + blogs[0].id + info.url.posts)
            .set("Authorization", info.headers.authorization)
            .send(inputPostByIdInfo)
            .expect(201);

        expect(post.body.title).toEqual(inputPostByIdInfo.title);
        expect(post.body.shortDescription).toEqual(inputPostByIdInfo.shortDescription);
        expect(post.body.content).toEqual(inputPostByIdInfo.content);
    });

    it(" GET|200 - pagination array with one post", async () => {
        const result = await agent
            .get(info.url.blogs + blogs[0].id + info.url.posts)
            .set("Authorization", info.headers.authorization)
            .expect(200);

        console.log(result.body)
        console.log(post)
        expect(result.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [post.body],
        });
    });

    it(" GET|404 - pagination blogId error", async () => {
        const result2 = await agent
            .get(info.url.blogs + faker.random.numeric(6) + info.url.posts)
            .set("Authorization", info.headers.authorization)
            .expect(404);
    });
});
describe.skip("/blogs", () => {
    let blogs: any = []
    const inputPostByIdInfo = testInputInfoPost()
    let post: any = {}
    beforeAll(async () => {

        await agent.delete(info.url.testingDelete);
        blogs = await testCreateBlogs(1)

    }, 8000);

    it(" POST|401 - POST POST BY BLOG ID auth error", async () => {
        const result = await agent
            .post(info.url.blogs + blogs[0].id + info.url.posts)
            .send(inputPostByIdInfo)
            .expect(401);
    });

    it(" POST|404 - POST POST BY BLOG ID blogId error", async () => {
        const result = await agent
            .post(info.url.blogs + faker.random.numeric(6) + info.url.posts)
            .set("Authorization", info.headers.authorization)
            .send(inputPostByIdInfo)
            .expect(404);
    });

    it(" POST|400 POST POST BY BLOG ID title error ", async () => {
        const result = await agent
            .post(info.url.blogs + faker.random.numeric(6) + info.url.posts)
            .send({...inputPostByIdInfo, title: faker.random.alpha(31)})
            .set("Authorization", info.headers.authorization)
            .expect(400);
    });

    it(" POST| 400 POST POST BY BLOG ID shortDescription error", async () => {
        const result = await agent
            .post(info.url.blogs + faker.random.numeric(6) + info.url.posts)
            .set("Authorization", info.headers.authorization)
            .send({...inputPostByIdInfo, shortDescription: faker.random.alpha(101)})
            .expect(400);
    });

    it(" POST| 400 POST POST BY BLOG ID content error ", async () => {
        const result = await agent
            .post(info.url.blogs + faker.random.numeric(6) + info.url.posts)
            .set("Authorization", info.headers.authorization)
            .send({...inputPostByIdInfo, content: faker.random.alpha(1001)})
            .expect(400);
    });
})

describe.skip("/posts", () => {
    let blogs: any = []
    let post: any = []
    beforeAll(async () => {

        await agent.delete(info.url.testingDelete);
        blogs = await testCreateBlogs(1)

    }, 8000);


    it(" POST|201 -  CREATE POST", async () => {
        post = await testCreatePosts({number: 1, blog: blogs[0]})

        expect(post[0].blogId).toEqual(blogs[0].id)
        expect(post[0].blogName).toEqual(blogs[0].name)

    });

    it(" GET|200 GET POST", async () => {
        const result = await agent.get(info.url.posts).expect(200);

        expect(result.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [post[0]],
        });
    });

    it(" GET|200 GET POST BY ID", async () => {

        const result = await agent
            .get(info.url.posts + post[0].id)
            .expect(200);

        expect(result.body).toEqual(post[0]);
    });

    it(" GET|404 GET POST BY ID error ", async () => {
        const result = await agent
            .get(info.url.posts + faker.random.numeric(6))
            .expect(404);
    });
})
describe.skip("/posts", () => {
    let blogs: any = []
    const inputPostByIdInfo = testInputInfoPost()
    beforeAll(async () => {

        await agent.delete(info.url.testingDelete);
        blogs = await testCreateBlogs(1)

    }, 8000);

    it("POST|400 - CREATE POST title error", async () => {
        const result = await agent
            .post(info.url.posts)
            .set("Authorization", info.headers.authorization)
            .send({
                ...inputPostByIdInfo,
                title: faker.random.alpha(31),
                blogId: blogs[0].id,
            })
            .expect(400);
    });

    it(" POST|400 - CREATE POST shortDescription error", async () => {
        const result = await agent
            .post(info.url.posts)
            .set("Authorization", info.headers.authorization)
            .send({
                ...inputPostByIdInfo,
                shortDescription: faker.random.alpha(101),
                blogId: blogs[0].id,
            })
            .expect(400);

    });

    it(" POST|400 - CREATE POST content error", async () => {
        const result = await agent
            .post(info.url.posts)
            .set("Authorization", info.headers.authorization)
            .send({
                ...inputPostByIdInfo,
                content: faker.random.alpha(1001),
                blogId: blogs[0].id,
            })
            .expect(400);

    });

    it(" POST|400 - CREATE POST blogId error ", async () => {
        const result = await agent
            .post(info.url.posts)
            .set("Authorization", info.headers.authorization)
            .send({
                ...inputPostByIdInfo,
                blogId: faker.random.numeric(6),
            })
            .expect(400);

    });

    it(" POST|401-  CREATE POST", async () => {
        const result = await agent
            .post(info.url.posts)
            .send({
                ...inputPostByIdInfo,
                blogId: blogs[0].id,
            })
            .expect(401);
    })
})
describe.skip("/posts", () => {
    let blogs: any = []
    let posts: any = []
    const inputPostByIdInfo = testInputInfoPost()

    beforeAll(async () => {

        await agent.delete(info.url.testingDelete);
        blogs = await testCreateBlogs(1)
        posts = await testCreatePosts({number: 1, blog: blogs[0]})

    }, 8000);

    it(" PUT|404- UPDATE POST ", async () => {

        const result3 = await agent
            .put(info.url.posts + faker.random.numeric(6))
            .set("Authorization", info.headers.authorization)
            .send({
                ...inputPostByIdInfo,
                blogId: blogs[0].id,
            })
            .expect(404);
    });

    it(" PUT|204 - UPDATE POST", async () => {

        const result = await agent
            .put(info.url.posts + posts[0].id)
            .set("Authorization", info.headers.authorization)
            .send({...inputPostByIdInfo, blogId: blogs[0].id})
            .expect(204);

        const result4 = await agent.get(info.url.posts + posts[0].id);

        expect(result4.body.title).toEqual(inputPostByIdInfo.title)
        expect(result4.body.shortDescription).toEqual(inputPostByIdInfo.shortDescription)
        expect(result4.body.content).toEqual(inputPostByIdInfo.content)
        expect(result4.body.blogId).toEqual(blogs[0].id)
        expect(result4.body.blogName).toEqual(blogs[0].name)

    });
})
describe.skip("/posts", () => {
    let blogs: any = []
    let posts: any = []
    const inputPostByIdInfo = testInputInfoPost()

    beforeAll(async () => {

        await agent.delete(info.url.testingDelete);
        blogs = await testCreateBlogs(1)
        posts = await testCreatePosts({number: 1, blog: blogs[0]})

    }, 8000);


    it(" PUT|400 UPDATE POST title error", async () => {

        const result = await agent
            .put(info.url.posts + posts[0].id)
            .set("Authorization", info.headers.authorization)
            .send({
                ...inputPostByIdInfo, title: faker.random.alpha(31),
                blogId: blogs[0].id,
            })
            .expect(400);
    });

    it("PUT|400 UPDATE POST shortDescription error", async () => {

        const result = await agent
            .put(info.url.posts + posts[0].id)
            .set("Authorization", info.headers.authorization)
            .send({
                ...inputPostByIdInfo, shortDescription: faker.random.alpha(101),
                blogId: blogs[0].id,
            })
            .expect(400);
    });

    it("PUT|400 UPDATE POST content error", async () => {

        const result = await agent
            .put(info.url.posts + posts[0].id)
            .set("Authorization", info.headers.authorization)
            .send({
                ...inputPostByIdInfo, content: faker.random.alpha(1001),
                blogId: blogs[0].id,
            })
            .expect(400);
    });

    it("PUT|400 UPDATE POST blogId error", async () => {

        const result = await agent
            .put(info.url.posts + posts[0].id)
            .set("Authorization", info.headers.authorization)
            .send({
                ...inputPostByIdInfo,
                blogId: faker.random.numeric(6),
            })
            .expect(400);
    });

    it(" PUT|401 UPDATE POST auth error", async () => {

        const result = await agent
            .put(info.url.posts + posts[0].id)
            .send({
                ...inputPostByIdInfo,
                blogId: blogs[0].id,
            })
            .expect(401);
    });

})
describe.skip("/posts", () => {
    let blogs: any = []
    let posts: any = []
    const inputPostByIdInfo = testInputInfoPost()

    beforeAll(async () => {

        await agent.delete(info.url.testingDelete);
        blogs = await testCreateBlogs(1)
        posts = await testCreatePosts({number: 1, blog: blogs[0]})

    }, 8000);

    it("DELETE|401 -  DELETE POST auth error", async () => {
        const result = await agent
            .delete(info.url.posts + posts[0].id)
            .expect(401);
    });

    it("DELETE|404 -  DELETE POST", async () => {
        const result3 = await agent
            .delete(info.url.posts + faker.random.numeric(6))
            .set("Authorization", info.headers.authorization)
            .expect(404);

    });
    it("204 DELETE POST ", async () => {
        const result = await agent
            .delete(info.url.posts + posts[0].id)
            .set("Authorization", info.headers.authorization)
            .expect(204);

        const result4 = await agent
            .get(info.url.posts + posts[0].id)
            .expect(404);
    });
})
describe.skip("/posts", () => {
    let blogs: any = []
    let posts: any = []
    const inputCommentInfo = testInputInfoComments()

    beforeAll(async () => {

        await agent.delete(info.url.testingDelete);
        blogs = await testCreateBlogs(1)
        posts = await testCreatePosts({number: 1, blog: blogs[0]})
    }, 8000);

    it("POST|201- POST COMMENTS BY POST ID", async () => {
        const inputInfoUser = testInputInfoUser()

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
            .post(info.url.posts + posts[0].id + info.url.comments)
            .send(inputCommentInfo)
            .set("Authorization", "Bearer " + login.body.accessToken)
            .expect(201);

        expect(comment.body.content).toEqual(inputCommentInfo.content)
        expect(comment.body.commentatorInfo.userId).toEqual(user.body.id)
        expect(comment.body.commentatorInfo.userLogin).toEqual(user.body.login)

    });
})
describe.skip("/posts", () => {
    let blogs: any = []
    let posts: any = []
    let login: any = {}
    const inputCommentInfo = testInputInfoComments()

    beforeAll(async () => {

        await agent.delete(info.url.testingDelete);
        blogs = await testCreateBlogs(1)
        posts = await testCreatePosts({number: 1, blog: blogs[0]})
    }, 8000);

    it("POST|400- POST COMMENTS BY POST ID content min max error", async () => {
        const inputInfoUser = testInputInfoUser()

        const user = await agent
            .post(info.url.users)
            .set("Authorization", info.headers.authorization)
            .send(inputInfoUser)
            .expect(201)

        login = await agent
            .post(info.url.auth.login)
            .send({
                loginOrEmail: inputInfoUser.email,
                password: inputInfoUser.password,
            })
            .expect(200);

        const commentMAX = await agent
            .post(info.url.posts + posts[0].id + info.url.comments)
            .send({...inputCommentInfo, postId: posts[0].id, content: faker.random.alpha(301)})
            .set("Authorization", "Bearer " + login.body.accessToken)
            .expect(400);

        const commentMIN = await agent
            .post(info.url.posts + posts[0].id + info.url.comments)
            .send({...inputCommentInfo, postId: posts[0].id, content: faker.random.alpha(19)})
            .set("Authorization", "Bearer " + login.body.accessToken)
            .expect(400);
    })

    it("POST| 401- POST COMMENTS BY POST ID auth error", async () => {
        const comment = await agent
            .post(info.url.posts + posts[0].id + info.url.comments)
            .set("Authorization", "Bearer " + faker.random.alpha(20))
            .send(inputCommentInfo)
            .expect(401);
    });

    it("POST|404- POST COMMENTS BY POST ID", async () => {
        const comment = await agent
            .post(info.url.posts + faker.random.numeric(6) + info.url.comments)
            .set("Authorization", "Bearer " + login.body.accessToken)
            .send(inputCommentInfo)
            .expect(404);
    });
})
describe.skip("/posts", () => {
    let blogs: any = []
    let posts: any = []
    let comments: any = []
    let login: any = {}
    const inputCommentInfo = testInputInfoComments()

    beforeAll(async () => {

        await agent.delete(info.url.testingDelete);
        blogs = await testCreateBlogs(1)
        posts = await testCreatePosts({number: 1, blog: blogs[0]})
        comments = await testCreateComments({number: 1, post: posts[0]})
    }, 8000);

    it("GET|200- GET COMMENTS BY POST ID", async () => {
        const result = await agent
            .get(info.url.posts + posts[0].id + info.url.comments)
            .expect(200);

        expect(result.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: comments,
        });
    }, 15000);

    it("GET|404 - GET COMMENTS BY POST ID", async () => {
        const result6 = await agent
            .get(info.url.posts + faker.random.numeric(6) + info.url.comments)
            .expect(404);
    })

})
describe.skip("/posts", () => {
    let blogs: any = []
    let posts: any = []
    const inputCommentInfo = testInputInfoComments()

    beforeAll(async () => {

        await agent.delete(info.url.testingDelete);
        blogs = await testCreateBlogs(1)
        posts = await testCreatePosts({number: 1, blog: blogs[0]})
    }, 8000);

    it("POST|201- LIKE COMMENTS ", async () => {
        const inputInfoUser = testInputInfoUser()

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
            .post(info.url.posts + posts[0].id + info.url.comments)
            .send(inputCommentInfo)
            .set("Authorization", "Bearer " + login.body.accessToken)
            .expect(201);

        const like = await agent
            .put(info.url.comments + comment.body.id + info.url.like)
            .send({likeStatus: "Like"})
            .set("Authorization", "Bearer " + login.body.accessToken)
            .expect(204);
        const dislike = await agent
            .put(info.url.comments + comment.body.id + info.url.like)
            .send({likeStatus: "Dislike"})
            .set("Authorization", "Bearer " + login.body.accessToken)
            .expect(204);

        const commentWithLike = await agent
            .get(info.url.comments + comment.body.id)
            .set("Authorization", "Bearer " + login.body.accessToken)
            .expect(200);

        


    });
})


describe.skip("/users", () => {
    let users: any = []

    beforeAll(async () => {
        await agent.delete(info.url.testingDelete);

    }, 8000);


    it("GET|201 POST USER", async () => {
        users = await testCreateUsers(1)

        expect(users.length).toEqual(1);
    });


    it("GET|200 GET USER", async () => {
        const result = await agent
            .get(info.url.users)
            .set("Authorization", info.headers.authorization)
            .expect(200);

        expect(result.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: users,
        });
    });

    it("GET|401- GET USER auth error", async () => {
        const result = await agent
            .get(info.url.users)
            .expect(401);
    });
});
describe.skip("/users", () => {
    let users: any = []
    const inputInfoUser = testInputInfoUser()
    beforeAll(async () => {
        await agent.delete(info.url.testingDelete);

    }, 8000);


    it("POST|400 - POST USER login min error ", async () => {
        const result = await agent
            .post(info.url.users)
            .set("Authorization", info.headers.authorization)
            .send({
                ...inputInfoUser, login: faker.random.alpha(2)
            })
            .expect(400);
    });

    it("POST|400 - POST USER login max error", async () => {
        const result = await agent
            .post(info.url.users)
            .set("Authorization", info.headers.authorization)
            .send({
                ...inputInfoUser, login: faker.random.alpha(11)
            })
            .expect(400);
    });

    it("POST| 400- POST USER password min error", async () => {
        const result = await agent
            .post(info.url.users)
            .set("Authorization", info.headers.authorization)
            .send({
                ...inputInfoUser, password: faker.random.alpha(5)
            })
            .expect(400);
    })

    it("POST| 400- POST USER password max error", async () => {
        const result = await agent
            .post(info.url.users)
            .set("Authorization", info.headers.authorization)
            .send({
                ...inputInfoUser, password: faker.random.alpha(21)
            })
            .expect(400);
    });

    it("POST| 401- POST USER auth error", async () => {
        const result = await agent
            .post(info.url.users)
            .send({
                ...inputInfoUser
            })
            .expect(401);
    });
})
describe.skip("/users", () => {
    let users: any = []
    const inputInfoUser = testInputInfoUser()
    beforeAll(async () => {
        await agent.delete(info.url.testingDelete);
        users = await testCreateUsers(1)
    }, 8000);


    it("DELETE|401 -DELETE USER auth error", async () => {
        const result = await agent
            .delete(info.url.users + users[0].id)
            .expect(401);
    });

    it("DELETE|401- DELETE USER", async () => {
        const result = await agent
            .delete(info.url.users + faker.random.numeric(6))
            .set("Authorization", info.headers.authorization)
            .expect(404);
    });

    it("DELETE|204- DELETE USER", async () => {

        const result = await agent
            .delete(info.url.users + users[0].id)
            .set("Authorization", info.headers.authorization)
            .expect(204);
    });

});


describe.skip("/auth", () => {

    let accessToken: any = {}
    let user: any = {}
    const inputInfoUser = testInputInfoUser()
    beforeAll(async () => {
        await agent.delete(info.url.testingDelete);
    }, 8000);

    it("POST|200- POST AUTH", async () => {
        user = await agent
            .post(info.url.users)
            .send(inputInfoUser)
            .set("Authorization", info.headers.authorization)
            .expect(201);

        const auth = await agent
            .post(info.url.auth.login)
            .send({
                loginOrEmail: inputInfoUser.login,
                password: inputInfoUser.password,
            })
            .expect(200);


        accessToken = auth.body.accessToken
    });

    it("GET|200 - GET AUTH", async () => {
        const authMe = await agent
            .get(info.url.auth.me)
            .set("Authorization", "Bearer " + accessToken)
            .expect(200);

        expect(authMe.body).toEqual({
            email: user.body.email,
            login: user.body.login,
            userId: user.body.id,
        });
    });

    it("POST|204 POST AUTH REGISTRATION ", async () => {
        const result = await agent
            .post(info.url.auth.registration)
            .send(testInputInfoUser())
            .expect(204);
    });
});
describe.skip("/auth", () => {
    let cookie: string[] = []
    let accessToken: any = {}
    let user: any = {}
    const inputInfoUser = testInputInfoUser()
    beforeAll(async () => {
        await agent.delete(info.url.testingDelete);
    }, 8000);

    it("POST|429- POST AUTH many request error", async () => {
        user = await agent
            .post(info.url.users)
            .send(inputInfoUser)
            .set("Authorization", info.headers.authorization)
            .expect(201);
        let i = 0
        do {
            const auth = await agent
                .post(info.url.auth.login)
                .send({
                    loginOrEmail: inputInfoUser.login,
                    password: inputInfoUser.password,
                })
                .expect(200);
            i++
        } while (i < 5)

        const authNumberSIX = await agent
            .post(info.url.auth.login)
            .send({
                loginOrEmail: inputInfoUser.login,
                password: inputInfoUser.password,
            })
            .expect(429);

        await new Promise((r) => setTimeout(r, 9000))

        const authAfter9sec = await agent
            .post(info.url.auth.login)
            .send({
                loginOrEmail: inputInfoUser.login,
                password: inputInfoUser.password,
            })
            .expect(200);
    }, 30000);
})
describe.skip("/auth", () => {

    const inputInfoUser = testInputInfoUser()
    beforeAll(async () => {
        await agent.delete(info.url.testingDelete);
    }, 8000);

    it("POST|400 -POST AUTH login is not string error", async () => {
        const auth = await agent
            .post(info.url.auth.login)
            .send({
                loginOrEmail: +faker.random.numeric(6),
                password: inputInfoUser.password,
            })
            .expect(400);
    });

    it("POST|400 -POST AUTH password is not string error", async () => {
        const auth = await agent
            .post(info.url.auth.login)
            .send({
                loginOrEmail: inputInfoUser.email,
                password: +faker.random.numeric(6),
            })
            .expect(400);
    });

    it("POST|401- POST AUTH auth error  ", async () => {
        const auth = await agent
            .post(info.url.auth.login)
            .send({
                loginOrEmail: faker.internet.email(),
                password: faker.internet.password(6),
            })
            .expect(401);
    });


    it("POST|400 POST AUTH REGISTRATION login min/max", async () => {
        const result = await agent
            .post(info.url.auth.registration)
            .send({...inputInfoUser, login: faker.random.alpha(2)})
            .expect(400);

        const result2 = await agent
            .post(info.url.auth.registration)
            .send({...inputInfoUser, login: faker.random.alpha(11)})
            .expect(400);
    });
    it("POST|400 POST AUTH REGISTRATION  password min/max", async () => {
        const result = await agent
            .post(info.url.auth.registration)
            .send({...inputInfoUser, password: faker.random.alpha(5)})
            .expect(400);

        const result2 = await agent
            .post(info.url.auth.registration)
            .send({...inputInfoUser, password: faker.random.alpha(21)})
            .expect(400);
    });
    it("POST|400 POST AUTH REGISTRATION email ", async () => {
        const result = await agent
            .post(info.url.auth.registration)
            .send({...inputInfoUser, email: faker.random.alpha(9)})
            .expect(400);

    })
})

//   // it("return 204 REGISTRATION CONFIRMATION POST ", async () => {
//   //   const result = await request(app)
//   //     .post("/auth/registration")
//   //     .send({
//   //       login: "egorus",
//   //       password: "123456u",
//   //       email: "egorvoron@gmail.com",
//   //     })
//   //     .expect(204);
//
//   //   const result2 = await usersCollections.findOne({
//   //     email: "egorvoron@gmail.com",
//   //   });
//
//   //   const result3 = await request(app)
//   //     .post("/auth/registration-confirmation")
//   //     .send({
//   //       code: result2!.emailConfimation.confimationCode,
//   //     })
//   //     .expect(204);
//   // });
//   // it("return 400 REGISTRATION CONFIRMATION POST use code after used  ", async () => {
//   //   const result = await request(app)
//   //     .post("/auth/registration")
//   //     .send({
//   //       login: "mariavog",
//   //       password: "123456u",
//   //       email: "mariavog@gmail.com",
//   //     })
//   //     .expect(204);
//
//   //   const result2 = await usersCollections.findOne({
//   //     email: "mariavog@gmail.com",
//   //   });
//
//   //   const result3 = await request(app)
//   //     .post("/auth/registration-confirmation")
//   //     .send({
//   //       code: result2!.emailConfimation.confimationCode,
//   //     })
//   //     .expect(204);
//
//   //   const result4 = await request(app)
//   //     .post("/auth/registration-confirmation")
//   //     .send({
//   //       code: result2!.emailConfimation.confimationCode,
//   //     })
//   //     .expect(400);
//   // });
//
//   // jest.setTimeout(8000);
//   // it("return 204 REGISTRATION  EMAIL RESENDING ", async () => {
//   //   const result = await request(app)
//   //     .post("/auth/registration")
//   //     .send({
//   //       login: "katerina",
//   //       password: "123456u",
//   //       email: "katerinagot@gmail.com",
//   //     })
//   //     .expect(204);
//   //   const result2 = await usersCollections.findOne({
//   //     email: "katerinagot@gmail.com",
//   //   });
//   //   const result3 = await request(app)
//   //     .post("/auth/registration-email-resending")
//   //     .send({ email: "katerinagot@gmail.com" })
//   //     .expect(204);
//
//   //   const result4 = await usersCollections.findOne({
//   //     email: "katerinagot@gmail.com",
//   //   });
//   //   expect(result2?.emailConfimation.confimationCode).not.toEqual(
//   //     result4?.emailConfimation.confimationCode
//   //   );
//   // });
// });

describe.skip("/auth/refresh-token", () => {
    let cookie: any = []
    const inputUserInfo = testInputInfoUser()
    beforeAll(async () => {
        await agent.delete(info.url.testingDelete);

        const user = await agent
            .post(info.url.users)
            .set("Authorization", info.headers.authorization)
            .send(inputUserInfo)
            .expect(201);

        const login = await agent
            .post(info.url.auth.login)
            .send({
                loginOrEmail: inputUserInfo.email,
                password: inputUserInfo.password,
            })
            .expect(200);

        cookie = login.get("Set-Cookie");
    }, 20000);

    it("POST|200- REFRESH TOKEN", async () => {
        const refreshToken = await agent
            .post(info.url.auth.refreshToken)
            .set("Cookie", cookie)
            .expect(200);
    });
});

describe.skip("/security", () => {
    let cookie: any = []
    const inputUserInfo = testInputInfoUser()
    beforeAll(async () => {
        await agent.delete(info.url.testingDelete);

        const user = await agent
            .post(info.url.users)
            .set("Authorization", info.headers.authorization)
            .send(inputUserInfo)
            .expect(201);

        const login = await agent
            .post(info.url.auth.login)
            .send({
                loginOrEmail: inputUserInfo.email,
                password: inputUserInfo.password,
            })
            .expect(200);

        cookie = login.get("Set-Cookie");
    }, 20000);

    it("GET|200-security devices ", async () => {
        const devices = await agent
            .get(info.url.security)
            .set("Cookie", cookie)
            .expect(200)
    })
})

describe.skip("/auth/logout", () => {
    const countOfDevices = 4;

    beforeAll(async () => {
        await agent.delete(info.url.testingDelete);

        const inputUserInfo = testInputInfoUser()
        const createUserResponse = await agent
            .post(info.url.users)
            .set("Authorization", info.headers.authorization)
            .send(inputUserInfo);

        expect(createUserResponse.status).toBe(201);

        const user = {...inputUserInfo, ...createUserResponse.body};

        const userRefreshTokens: any[] = []

        for (let i = 0; i < countOfDevices; i++) {
            const loginUserResponse = await agent.post(info.url.auth.login)
                .set('User-Agent', faker.internet.userAgent())
                .send({
                    loginOrEmail: user.login,
                    password: user.password,
                });

            expect(loginUserResponse.status).toBe(200);
            const {accessToken} = loginUserResponse.body;
            expect(accessToken).toBeDefined();
            const cookie = loginUserResponse.get("Set-Cookie");
            expect(cookie).toBeDefined();
            user.accessToken = accessToken;
            user.cookie = cookie;
            userRefreshTokens.push(cookie)
        }
        expect(userRefreshTokens).toHaveLength(countOfDevices)
        expect.setState({user, userRefreshTokens});
    }, 10000);

    it(`return 200 and all devices (${countOfDevices})`, async () => {
        const {user} = expect.getState();
        const devicesListResponse = await agent
            .get(info.url.security)
            .set("Cookie", user.cookie);


        expect(devicesListResponse.status).toBe(200);
        expect(devicesListResponse.body).toHaveLength(countOfDevices);
    });
    it('should logout user first device', async () => {
        const {userRefreshTokens, user} = expect.getState();

        const logoutResponse = await agent.post(info.url.auth.logout).set("Cookie", userRefreshTokens[0]).send({})
        expect(logoutResponse.status).toBe(204)


        const devicesListResponse = await agent
            .get(info.url.security)
            .set("Cookie", user.cookie);


        expect(devicesListResponse.status).toBe(200);
        expect(devicesListResponse.body).toHaveLength(countOfDevices - 1);
    })
});

describe.skip("/security", () => {
    let cookie: any = []
    const inputUserInfo = testInputInfoUser()
    beforeAll(async () => {
        await agent.delete(info.url.testingDelete);

        const user = await agent
            .post(info.url.users)
            .set("Authorization", info.headers.authorization)
            .send(inputUserInfo)
            .expect(201);

        const login = await agent
            .post(info.url.auth.login)
            .send({
                loginOrEmail: inputUserInfo.email,
                password: inputUserInfo.password,
            })
            .expect(200);

        cookie = login.get("Set-Cookie");
    }, 20000);

    it("DELETE|204 ", async () => {
        const device = await agent
            .get(info.url.security)
            .set("Cookie", cookie)
            .expect(200);

        const result = await agent
            .delete(info.url.security)
            .set("Cookie", cookie)
            .expect(204);
    });
});

describe.skip("/security", () => {
    let cookie: any = []
    const inputUserInfo = testInputInfoUser()
    beforeAll(async () => {
        await agent.delete(info.url.testingDelete);
        let i = 0

        const user = await agent
            .post(info.url.users)
            .set("Authorization", info.headers.authorization)
            .send(inputUserInfo)
            .expect(201);
        do {
            const login = await agent
                .post(info.url.auth.login)
                .send({
                    loginOrEmail: inputUserInfo.email,
                    password: inputUserInfo.password,
                })
                .expect(200);

            cookie = login.get("Set-Cookie");
            i++
        } while (i < 2)
    }, 20000);

    it("DELETE|204 - all, not me", async () => {
        const devices = await agent
            .get(info.url.security)
            .set("Cookie", cookie)
            .expect(200);

        const device1 = devices.body[1].deviceId;

        const result = await agent
            .delete(info.url.security)
            .set("Cookie", cookie)
            .expect(204);

        const devicesAgain = await agent
            .get(info.url.security)
            .set("Cookie", cookie)
            .expect(200);

        expect(devicesAgain.body[0].deviceId).toEqual(device1)
    });
});

describe.skip("/security", () => {
    let cookie: any = []
    const inputUserInfo = testInputInfoUser()
    beforeAll(async () => {
        await agent.delete(info.url.testingDelete);
        let i = 0

        const user = await agent
            .post(info.url.users)
            .set("Authorization", info.headers.authorization)
            .send(inputUserInfo)
            .expect(201);
        do {
            const login = await agent
                .post(info.url.auth.login)
                .send({
                    loginOrEmail: inputUserInfo.email,
                    password: inputUserInfo.password,
                })
                .expect(200);

            cookie = login.get("Set-Cookie");
            i++
        } while (i < 2)
    }, 20000);

    it("DELETE|204 - by id", async () => {
        const devices = await agent
            .get(info.url.security)
            .set("Cookie", cookie)
            .expect(200);

        const device1 = devices.body[1].deviceId;

        const result = await agent
            .delete(info.url.security + devices.body[0].deviceId)
            .set("Cookie", cookie)
            .expect(204);

        const devicesAgain = await agent
            .get(info.url.security)
            .set("Cookie", cookie)
            .expect(200);

        expect(devicesAgain.body[0].deviceId).toEqual(device1)
    });
});


describe.skip("/comments", () => {
    let blogs: any = []
    let posts: any = []
    let comment: any = {}
    let login: any = {}
    const inputCommentInfo = testInputInfoComments()
    const inputInfoUser = testInputInfoUser()
    beforeAll(async () => {

        await agent.delete(info.url.testingDelete);
        blogs = await testCreateBlogs(1)
        posts = await testCreatePosts({number: 1, blog: blogs[0]})
    }, 8000);

    it("UPDATE|204 - update comment", async () => {


        const user = await agent
            .post(info.url.users)
            .set("Authorization", info.headers.authorization)
            .send(inputInfoUser)
            .expect(201)

        login = await agent
            .post(info.url.auth.login)
            .send({
                loginOrEmail: inputInfoUser.email,
                password: inputInfoUser.password,
            })
            .expect(200);

        const commentCreate = await agent
            .post(info.url.posts + posts[0].id + info.url.comments)
            .send(inputCommentInfo)
            .set("Authorization", "Bearer " + login.body.accessToken)
            .expect(201);

        const newContent = testInputInfoComments()

        const commentUpdate = await agent
            .put(info.url.comments + commentCreate.body.id)
            .set("Authorization", "Bearer " + login.body.accessToken)
            .send(newContent)
            .expect(204);

        comment = await agent
            .get(info.url.comments + commentCreate.body.id)
            .expect(200);

        expect(comment.body.content).toEqual(newContent.content)
    })

    it("UPDATE| 400-  UPDATE COMMENT min max content error", async () => {

        const commentMin = await agent
            .put(info.url.comments + comment.body.id)
            .set("Authorization", "Bearer " + login.body.accessToken)
            .send({content: faker.random.alpha(19)})
            .expect(400);

        const commentMax = await agent
            .put(info.url.comments + comment.body.id)
            .set("Authorization", "Bearer " + login.body.accessToken)
            .send({content: faker.random.alpha(301)})
            .expect(400);

    })

    it("UPDATE| 401 -UPDATE COMMENT auth error", async () => {
        const commentUpdate = await agent
            .put(info.url.comments + comment.body.id)
            .send(testInputInfoComments())
            .expect(401);
    });

    it("UPDATE| 403 - UPDATE COMMENT another users comment error", async () => {
        let newUserInfo = testInputInfoUser()
        const userB = await agent
            .post(info.url.users)
            .set("Authorization", info.headers.authorization)
            .send(newUserInfo)
            .expect(201)

        const loginB = await agent
            .post(info.url.auth.login)
            .send({
                loginOrEmail: newUserInfo.email,
                password: newUserInfo.password,
            })
            .expect(200);

        const commentUpdate = await agent
            .put(info.url.comments + comment.body.id)
            .set("Authorization", "Bearer " + loginB.body.accessToken)
            .send(testInputInfoComments())
            .expect(403);
    })

    it("UPDATE|404-  UPDATE COMMENT ", async () => {
        const commentUpdate = await agent
            .put(info.url.comments + faker.random.numeric(6))
            .set("Authorization", "Bearer " + login.body.accessToken)
            .send(testInputInfoComments())
            .expect(404);

    })
})

describe.skip("/comments", () => {
    let blogs: any = []
    let posts: any = []
    let commentCreate: any = {}
    let login: any = {}
    const inputCommentInfo = testInputInfoComments()
    const inputInfoUser = testInputInfoUser()
    beforeAll(async () => {

        await agent.delete(info.url.testingDelete);
        blogs = await testCreateBlogs(1)
        posts = await testCreatePosts({number: 1, blog: blogs[0]})
    }, 8000);


    it("DELETE|204 - delete comment", async () => {


        const user = await agent
            .post(info.url.users)
            .set("Authorization", info.headers.authorization)
            .send(inputInfoUser)
            .expect(201)

        login = await agent
            .post(info.url.auth.login)
            .send({
                loginOrEmail: inputInfoUser.email,
                password: inputInfoUser.password,
            })
            .expect(200);

        commentCreate = await agent
            .post(info.url.posts + posts[0].id + info.url.comments)
            .send(inputCommentInfo)
            .set("Authorization", "Bearer " + login.body.accessToken)
            .expect(201);

        const commentDelete = await agent
            .delete(info.url.comments + commentCreate.body.id)
            .set("Authorization", "Bearer " + login.body.accessToken)
            .expect(204);

        const commentFind = await agent
            .get(info.url.comments + commentCreate.body.id)
            .expect(404);

    })
    it("DELETE| 404 DELETE COMMENTS ", async () => {
        const commentDelete = await agent
            .delete(info.url.comments + faker.random.numeric(6))
            .set("Authorization", "Bearer " + login.body.accessToken)
            .expect(404);

    });
})
describe.skip("/comments", () => {
    let blogs: any = []
    let posts: any = []
    let commentCreate: any = {}
    let login: any = {}
    const inputCommentInfo = testInputInfoComments()
    const inputInfoUser = testInputInfoUser()
    beforeAll(async () => {

        await agent.delete(info.url.testingDelete);
        blogs = await testCreateBlogs(1)
        posts = await testCreatePosts({number: 1, blog: blogs[0]})
    }, 8000);


    it("DELETE| 401- DELETE COMMENTS auth error ", async () => {


        const user = await agent
            .post(info.url.users)
            .set("Authorization", info.headers.authorization)
            .send(inputInfoUser)
            .expect(201)

        login = await agent
            .post(info.url.auth.login)
            .send({
                loginOrEmail: inputInfoUser.email,
                password: inputInfoUser.password,
            })
            .expect(200);

        commentCreate = await agent
            .post(info.url.posts + posts[0].id + info.url.comments)
            .send(inputCommentInfo)
            .set("Authorization", "Bearer " + login.body.accessToken)
            .expect(201);

        const commentDelete = await agent
            .delete(info.url.comments + commentCreate.body.id)
            .expect(401);

    });

    it("return 403 DELETECOMMENTS ", async () => {
        const inputInfoUserNEW = testInputInfoUser()
        const user = await agent
            .post(info.url.users)
            .set("Authorization", info.headers.authorization)
            .send(inputInfoUserNEW)
            .expect(201)

        login = await agent
            .post(info.url.auth.login)
            .send({
                loginOrEmail: inputInfoUserNEW.email,
                password: inputInfoUserNEW.password,
            })
            .expect(200);

        const commentDelete = await agent
            .delete(info.url.comments + commentCreate.body.id)
            .set("Authorization", "Bearer " + login.body.accessToken)
            .expect(403);

        const commentFind = await agent
            .get(info.url.comments + commentCreate.body.id)
            .expect(200);
    })
})

describe.skip("/auth", () => {
    let users: any = []

    beforeAll(async () => {
        await agent.delete(info.url.testingDelete);

    }, 8000);


    it("POST 204| AUTH recovery password ", async () => {
        users = await testCreateUsers(1)

        const recovery = await agent
            .post("/auth/password-recovery")
            .send({email: users[0].email})
            .expect(204)
    })
})