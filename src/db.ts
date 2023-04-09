import mongoose from 'mongoose';
import * as dotenv from 'dotenv'
import {SecurityDevicesDBModel} from "./SecurityDevices/4_securityDevicesType";
import {PostDBModel} from "./Posts/4_postsType";
import {BlogDBModel} from "./Blogs/4_blogsType";
import {UserDBModel} from "./Users/4_userType";
import {CommentDBModel} from "./Comments/4_commentsType";
import {IpDataDBModel} from "./IpData/ipDataType";

dotenv.config()

const mongoUri = process.env.MONGO_URL;

const dbName = "kamasutra";

//BLOGS
const BlogSchema = new mongoose.Schema<BlogDBModel>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    isMembership: {type: Boolean, required: true},
}, {timestamps: true})
export const BlogModelClass = mongoose.model("Blogs", BlogSchema)
BlogModelClass.watch().on('change', change => console.log(change));

//POST
const PostSchema = new mongoose.Schema<PostDBModel>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
}, {timestamps: true})
export const PostModelClass = mongoose.model("Posts", PostSchema)
PostModelClass.watch().on('change', change => console.log(change));

//COMMENT
const CommentSchema = new mongoose.Schema<CommentDBModel>({
    content: {type: String, required: true},
    commentatorInfo: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true},
    },
    postId: {type: String, required: true},
    likesInfo: {
        likesCount: {type: Array, required: true},
        dislikesCount: {type: Array, required: true},
        myStatus: {type: String, required: true}
    }
}, {timestamps: true})
export const CommentModelClass = mongoose.model("Comments", CommentSchema)
CommentModelClass.watch().on('change', change => console.log(change));

//USER
const UserSchema = new mongoose.Schema<UserDBModel>({
    login: {type: String, required: true},
    email: {type: String, required: true},
    hash: {type: String, required: true},
    emailConfirmation: {
        confirmationCode: {type: String, required: true},
        expirationDate: {type: Date, required: true},
        isConfirmed: {type: Boolean, required: true}
    }
}, {timestamps: true})

export const UserModelClass = mongoose.model("Users", UserSchema)
UserModelClass.watch().on('change', change => console.log(change));

//SECURITY DEVICES
export const SecurityDevicesSchema = new mongoose.Schema<SecurityDevicesDBModel>({
    ip: {type: String, required: true},
    title: {type: String, required: true},
    lastActiveDate: {type: String, required: true},
    expirationDate: {type: String, required: true},
    deviceId: {type: String, required: true},
    userId: {type: String, required: true}
})
export const SecurityDevicesModelClass = mongoose.model("SecurityDevices", SecurityDevicesSchema)
SecurityDevicesModelClass.watch().on('change', change => console.log(change));

//IP DATA
const IpDataSchema = new mongoose.Schema<IpDataDBModel>({
    ip: {type: String, required: true},
    data: {type: Number, required: true},
    route: {type: String, required: true}
})
export const IpDataModelClass = mongoose.model("IpData", IpDataSchema)
IpDataModelClass.watch().on('change', change => console.log(change));

export async function runDb() {

    try {
        // Connect the client to the server
        if (!mongoUri) {
            throw new Error('! URL DOESNT FOUND ')
        }
        await mongoose.connect(mongoUri, {dbName});
        console.log("Connected successfully to mongo server");

    } catch {
        console.log("Can't connect to db");
        // Ensures that the client will close when you finish/error
        await mongoose.disconnect();
    }
}
