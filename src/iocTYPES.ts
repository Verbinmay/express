import {BlogsService} from "./Blogs/2_blogsService";
import {BlogsRepository} from "./Blogs/3.1_blogsRepository";
import {BlogsQRepository} from "./Blogs/3.0_blogQueryRepository";
import {BlogsController} from "./Blogs/1.1_blogsController";

export const TYPES = {
    //BLOGS
    BlogsController: Symbol.for('BlogsController'),
    BlogsService: Symbol.for('BlogsService'),
    BlogsRepository: Symbol.for("BlogsRepository"),
    BlogsQRepository: Symbol.for('BlogsQRepository'),

    //POST
    PostsController: Symbol.for('PostsController'),
    PostsService: Symbol.for('PostsService'),
    PostsRepository: Symbol.for("PostsRepository"),
    PostsQRepository: Symbol.for('PostsQRepository'),

    //COMMENTS
    CommentsController: Symbol.for('CommentsController'),
    CommentsService: Symbol.for('CommentsService'),
    CommentsRepository: Symbol.for("CommentsRepository"),
    CommentsQRepository: Symbol.for('CommentsQRepository'),

    //AUTH
    AuthController: Symbol.for('AuthController'),
    AuthService: Symbol.for('AuthService'),
    AuthRepository: Symbol.for("AuthRepository"),
    AuthQRepository: Symbol.for('AuthQRepository'),

    //USER
    UsersController: Symbol.for('UsersController'),
    UsersService: Symbol.for('UsersService'),
    UsersRepository: Symbol.for('UsersRepository'),
    UsersQRepository: Symbol.for('UsersQRepository'),

    //SECURITY DEVICES
    SecurityController: Symbol.for('SecurityController'),
    SecurityDevicesService: Symbol.for('SecurityDevicesService'),
    SecurityDevicesRepository: Symbol.for("SecurityDevicesRepository"),
    SecurityDevicesQRepository: Symbol.for('SecurityDevicesQRepository'),

    //EMAIL
    EmailsAdapter: Symbol.for('EmailsAdapter'),

    //JWT
    JwtService: Symbol.for('JwtService'),

    //IP DATA
    IpDataRepository: Symbol.for('IpDataRepository'),

}

