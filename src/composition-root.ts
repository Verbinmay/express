import "reflect-metadata"
import {Container} from "inversify";
import {BlogsController} from "./Blogs/1.1_blogsController";
import {BlogsService} from "./Blogs/2_blogsService";
import {BlogsQRepository} from "./Blogs/3.0_blogQueryRepository";
import {BlogsRepository} from "./Blogs/3.1_blogsRepository";
import {AuthController} from "./Auth/1.1_authController";
import {AuthService} from "./Auth/2_authService";
import {UsersService} from "./Users/2_usersService";
import {SecurityDevicesService} from "./SecurityDevices/2_securityDevicesService";
import {AuthRepository} from "./Auth/3.1_authRepository";
import {AuthQRepository} from "./Auth/3.0_authQueryRepository";
import {UsersRepository} from "./Users/3.1_usersRepository";
import {EmailsAdapter} from "./Email/emailAdapter";
import {JwtService} from "./JWT/jwtService";
import {CommentsController} from "./Comments/1.1_commentsController";
import {CommentsService} from "./Comments/2_commentsService";
import {CommentsRepository} from "./Comments/3.1_commentsRepository";
import {CommentsQRepository} from "./Comments/3.0_commentsQueryRepository";
import {IpDataRepository} from "./IpData/ipDataRepository";
import {PostsController} from "./Posts/1.1_postsController";
import {PostsService} from "./Posts/2_postsService";
import {PostsRepository} from "./Posts/3.1_postsRepository";
import {PostsQRepository} from "./Posts/3.0_postsQueryRepository";
import {UsersQRepository} from "./Users/3.0_usersQueryRepository";
import {SecurityController} from "./SecurityDevices/1.1_securityController";
import {SecurityDevicesRepository} from "./SecurityDevices/3.1_securityDevicesRepository";
import {SecurityDevicesQRepository} from "./SecurityDevices/3.0_securityDevicesQueryRepository";
import {UsersController} from "./Users/1.1_usersController";
import {TYPES} from "./iocTYPES";



export let container = new Container()

//JWT
container.bind<JwtService>(TYPES.JwtService).to(JwtService)

export const securityDevicesRepository = new SecurityDevicesRepository

export const jwtService = new JwtService(securityDevicesRepository)
//BLOGS
container.bind<BlogsController>(TYPES.BlogsController).to(BlogsController)
container.bind<BlogsService>(TYPES.BlogsService).to(BlogsService)
container.bind<BlogsRepository>(TYPES.BlogsRepository).to(BlogsRepository)
container.bind<BlogsQRepository>(TYPES.BlogsQRepository).to(BlogsQRepository)

//POST
container.bind<PostsController>(TYPES.PostsController).to(PostsController)
container.bind<PostsService>(TYPES.PostsService).to(PostsService)
container.bind<PostsRepository>(TYPES.PostsRepository).to(PostsRepository)
container.bind<PostsQRepository>(TYPES.PostsQRepository).to(PostsQRepository)


//COMMENTS
container.bind<CommentsController>(TYPES.CommentsController).to(CommentsController)
container.bind<CommentsService>(TYPES.CommentsService).to(CommentsService)
container.bind<CommentsRepository>(TYPES.CommentsRepository).to(CommentsRepository)
container.bind<CommentsQRepository>(TYPES.CommentsQRepository).to(CommentsQRepository)


//AUTH
container.bind<AuthController>(TYPES.AuthController).to(AuthController)
container.bind<AuthService>(TYPES.AuthService).to(AuthService)
container.bind<AuthRepository>(TYPES.AuthRepository).to(AuthRepository)
container.bind<AuthQRepository>(TYPES.AuthQRepository).to(AuthQRepository)

//USER
container.bind<UsersController>(TYPES.UsersController).to(UsersController)
container.bind<UsersService>(TYPES.UsersService).to(UsersService)
container.bind<UsersRepository>(TYPES.UsersRepository).to(UsersRepository)
container.bind<UsersQRepository>(TYPES.UsersQRepository).to(UsersQRepository)

//SECURITY DEVICES
container.bind<SecurityController>(TYPES.SecurityController).to(SecurityController)
container.bind<SecurityDevicesService>(TYPES.SecurityDevicesService).to(SecurityDevicesService)
container.bind<SecurityDevicesRepository>(TYPES.SecurityDevicesRepository).to(SecurityDevicesRepository)
container.bind<SecurityDevicesQRepository>(TYPES.SecurityDevicesQRepository).to(SecurityDevicesQRepository)

//EMAIL
container.bind<EmailsAdapter>(TYPES.EmailsAdapter).to(EmailsAdapter)

//IP DATA
container.bind<IpDataRepository>(TYPES.IpDataRepository).to(IpDataRepository)

