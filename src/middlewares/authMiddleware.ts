import { NextFunction, Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { jwtService } from "../composition-root";


export const AccessTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    res.sendStatus(401);
    return;
  }
  const token = req.headers.authorization.split(" ")[1];

  const verify: JwtPayload | null = await jwtService.verifyToken(token!);
  if (verify) {
    req.user = verify;
    next();
    return;
  } else {
    res.sendStatus(401);
  }
};

export const RefreshTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) {
    res.sendStatus(401);
    return;
  }
  const verify: JwtPayload | null = await jwtService.verifyToken(
    refreshToken
  );
 
  if (verify) {
    req.user = verify;
    next();
    return;
  } else {
    res.sendStatus(401);
  }
};


