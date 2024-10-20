import { auth } from "express-oauth2-jwt-bearer";

/**
 * JWT check middleware
 * @description Checks if the token is valid and has the correct audience
 */
export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: process.env.AUTH0_TOKEN_SIGNING_ALG,
});
