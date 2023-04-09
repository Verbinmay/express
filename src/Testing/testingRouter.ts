import {Request, Response, Router} from "express";
import {
    BlogModelClass, PostModelClass, UserModelClass, CommentModelClass, IpDataModelClass, SecurityDevicesModelClass
} from "../db";

export const testingRouter = Router({});

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
    await BlogModelClass.deleteMany({});
    await PostModelClass.deleteMany({});
    await UserModelClass.deleteMany({});
    await CommentModelClass.deleteMany({});
    await IpDataModelClass.deleteMany({});
    await SecurityDevicesModelClass.deleteMany({});

    res.sendStatus(204);
});