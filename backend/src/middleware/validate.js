import { AppError } from "../utils/errors.js";
export const validate =
  (schema, key = "body") =>
  (req, res, next) => {
    const result = schema.safeParse(req[key]);
    if (!result.success)
      return next(
        new AppError(
          422,
          "Check the information and try again.",
          result.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        ),
      );
    req.validated = { ...req.validated, [key]: result.data };
    next();
  };
