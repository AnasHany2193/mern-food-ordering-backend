import jwt from "jsonwebtoken";
import { auth } from "express-oauth2-jwt-bearer";
import { NextFunction, Request, Response } from "express";

import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      auth0Id: string;
      userId: string;
    }
  }
}

/**
 * JWT check middleware
 * @description Checks if the token is valid and has the correct audience
 */
export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: process.env.AUTH0_TOKEN_SIGNING_ALG,
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer")) {
    res.sendStatus(401);
    return;
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const auth0Id = decoded.sub;

    const user = await User.findOne({ auth0Id });

    if (!user) {
      res.sendStatus(401);
      return;
    }

    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();
  } catch (error) {
    res.sendStatus(401);
    return;
  }

  next();
};
