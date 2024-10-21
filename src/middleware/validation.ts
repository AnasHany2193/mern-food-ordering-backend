import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

/**
 * Handle validation errors
 * @description Handles validation errors and returns a 400 error response with the error messages in the body if there are any errors
 */
const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

/**
 * Validate user request
 * @description Validates the user request and returns a 400 error response with the error messages in the body if there are any errors
 */
export const validateMyUserRequest = [
  body("name").isString().notEmpty().withMessage("Name must be a string"),
  body("city").isString().notEmpty().withMessage("City must be a string"),
  body("country").isString().notEmpty().withMessage("Country must be a string"),
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("Address line 1 must be a string"),
  handleValidationErrors,
];
