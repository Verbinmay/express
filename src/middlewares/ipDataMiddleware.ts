import {NextFunction, Request, Response} from "express";
import {container} from "../composition-root";
import {IpDataRepository} from "../IpData/ipDataRepository";

const ipDataRepository = container.resolve(IpDataRepository)


export const ipDataMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const route = (req.url).toString()
    const timeInSec = 10;
    const attempts = 5;
    const ipDataCheck: boolean = await ipDataRepository.checkIpData(
        {
            ip: req.ip,
            timeInSec: timeInSec,
            attempts: attempts,
            route: route,
        }
    );
    if (!ipDataCheck) {
        res.sendStatus(429);
        return;
    }
    await ipDataRepository.addIpData({ip: req.ip, route: route});
    next();
};
