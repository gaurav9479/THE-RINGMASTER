import Joi from "joi";

export const createStorySchema = Joi.object({
    title: Joi.string()
        .min(5)
        .max(200)
        .required()
        .messages({
            'string.min': 'Title must be at least 5 characters',
            'string.max': 'Title cannot exceed 200 characters',
            'any.required': 'Title is required'
        }),

    content: Joi.string()
        .min(20)
        .max(10000)
        .required()
        .messages({
            'string.min': 'Content must be at least 20 characters',
            'string.max': 'Content cannot exceed 10000 characters',
            'any.required': 'Content is required'
        }),

    location: Joi.object({
        name: Joi.string()
            .max(200)
            .required()
            .messages({
                'any.required': 'Location name is required'
            }),
        city: Joi.string().max(100).allow(''),
        country: Joi.string().max(100).allow('')
    }).required(),

    rating: Joi.number()
        .min(1)
        .max(5)
        .messages({
            'number.min': 'Rating must be at least 1',
            'number.max': 'Rating cannot exceed 5'
        }),

    tags: Joi.array()
        .items(Joi.string().max(50))
        .max(10)
        .messages({
            'array.max': 'Cannot add more than 10 tags'
        }),

    visitDate: Joi.date()
        .max('now')
        .messages({
            'date.max': 'Visit date cannot be in the future'
        }),

    isPublished: Joi.boolean().default(true)
});

export const updateStorySchema = Joi.object({
    title: Joi.string()
        .min(5)
        .max(200)
        .messages({
            'string.min': 'Title must be at least 5 characters',
            'string.max': 'Title cannot exceed 200 characters'
        }),

    content: Joi.string()
        .min(20)
        .max(10000)
        .messages({
            'string.min': 'Content must be at least 20 characters',
            'string.max': 'Content cannot exceed 10000 characters'
        }),

    location: Joi.object({
        name: Joi.string().max(200),
        city: Joi.string().max(100).allow(''),
        country: Joi.string().max(100).allow('')
    }),

    rating: Joi.number()
        .min(1)
        .max(5),

    tags: Joi.array()
        .items(Joi.string().max(50))
        .max(10),

    visitDate: Joi.date()
        .max('now'),

    isPublished: Joi.boolean()
});

export const commentSchema = Joi.object({
    content: Joi.string()
        .min(1)
        .max(1000)
        .required()
        .messages({
            'string.min': 'Comment cannot be empty',
            'string.max': 'Comment cannot exceed 1000 characters',
            'any.required': 'Comment content is required'
        })
});
