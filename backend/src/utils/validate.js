import { sendError } from './response.js';

/**
 * Express middleware factory that validates req.body against a Zod schema.
 * Returns 400 with structured validation errors on failure.
 * @param {import('zod').ZodSchema} schema
 */
export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return sendError(_res, 'Validation failed', 400, errors);
    }

    // Replace req.body with the parsed (and possibly transformed) data
    req.body = result.data;
    next();
  };
}
