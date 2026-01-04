import { ApiError } from "../utils/ApiError.js";

/**
 * Validation middleware factory
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {string} property - Request property to validate ('body', 'query', 'params')
 */
export const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false, // Return all errors, not just the first
            stripUnknown: true, // Remove unknown fields
        });

        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return next(new ApiError(400, "Validation failed", errorMessages));
        }

        // Replace request property with validated and sanitized value
        req[property] = value;
        next();
    };
};

export default validate;
