import {SecurityDevicesService} from "./2_securityDevicesService";
import {Request, Response} from "express";
import {SecurityDevicesDBModel, SecurityDevicesViewModel} from "./4_securityDevicesType";
import {inject, injectable} from "inversify";
import {TYPES} from "../iocTYPES";

@injectable()
export class SecurityController {
    constructor(
        @inject(TYPES.SecurityDevicesService) protected securityDevicesService: SecurityDevicesService
    ) {
    }

    async getDevice(req: Request, res: Response) {
        const session: SecurityDevicesViewModel[] = await this.securityDevicesService.findSessionsById(
            req.user.userId
        );
        res.status(200).send(session);
    }

    async deleteAllDevices(req: Request, res: Response) {
        const sessionsDelete: boolean = await this.securityDevicesService.deleteSessions({
            userId: req.user.userId,
            deviceId: req.user.deviceId
        });
        sessionsDelete ? res.send(204) : res.send(401);
    }

    async deleteOneDevice(req: Request, res: Response) {
        const session: SecurityDevicesDBModel | null =
            await this.securityDevicesService.findSessionByDeviceId(
                req.params.deviceId
            );
        if (!session) {
            res.send(404);
            return;
        }
        if (session.userId !== req.user.userId) {
            res.send(403);
        }

        const sessionDelete: boolean =
            await this.securityDevicesService.deleteSessionsByDeviceId(
                req.params.deviceId
            );
        sessionDelete ?
            res.send(204) : res.send(404)
    }


}