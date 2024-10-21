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
  console.log("authorization", authorization);

  const token = authorization.split(" ")[1];
  console.log("token", token);

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    console.log("decoded", decoded);

    const auth0Id = decoded.sub;
    console.log("auth0Id", auth0Id);

    const user = await User.findOne({ auth0Id });
    console.log("user", user);

    if (!user) {
      res.sendStatus(401);
      return;
    }

    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    res.sendStatus(401);
    return;
  }

  next();
};
