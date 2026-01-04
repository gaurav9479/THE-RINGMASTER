import Joi from "joi";

export const searchCitySchema = Joi.object({
    destination: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Destination must be at least 2 characters',
            'string.max': 'Destination cannot exceed 100 characters',
            'any.required': 'Destination is required'
        }),

    // Pagination
    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(50)
        .default(10),

    // Filters
    minPrice: Joi.number()
        .min(0)
        .optional(),

    maxPrice: Joi.number()
        .min(0)
        .optional(),

    minRating: Joi.number()
        .min(0)
        .max(5)
        .optional(),

    amenities: Joi.string()
        .optional(),

    // Sorting
    sortBy: Joi.string()
        .valid('price_per_night', 'rating', 'name')
        .default('rating'),

    sortOrder: Joi.string()
        .valid('asc', 'desc')
        .default('desc')
});

export const weatherSchema = Joi.object({
    destination: Joi.string()
        .min(2)
        .max(100)
        .required(),

    startDate: Joi.date()
        .iso()
        .required()
        .messages({
            'date.format': 'Start date must be in ISO format (YYYY-MM-DD)',
            'any.required': 'Start date is required'
        }),

    endDate: Joi.date()
        .iso()
        .min(Joi.ref('startDate'))
        .required()
        .messages({
            'date.min': 'End date must be after start date',
            'any.required': 'End date is required'
        })
});
