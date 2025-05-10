const Joi = require('joi');

exports.createProduct = Joi.object({
    name: Joi.string()
        .required()
        .messages({
            'string.empty': 'Product name is required',
            'any.required': 'Product name is required'
        }),
    description: Joi.string()
        .required()
        .messages({
            'string.empty': 'Description is required',
            'any.required': 'Description is required'
        }),
    photo: Joi.string()
        .required()
        .messages({
            'string.empty': 'Photo URL is required',
            'any.required': 'Photo URL is required'
        })
});

exports.updateProduct = Joi.object({
    name: Joi.string()
        .optional()
        .messages({
            'string.empty': 'Product name cannot be empty'
        }),
    description: Joi.string()
        .optional()
        .messages({
            'string.empty': 'Description cannot be empty'
        }),
    photo: Joi.string()
        .optional()
        .messages({
            'string.empty': 'Photo URL cannot be empty'
        })
});

exports.searchProduct = Joi.object({
    search: Joi.string()
        .optional()
        .messages({
            'string.base': 'Search must be a string'
        }),
    seller: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .optional()
        .messages({
            'string.pattern.base': 'Seller ID is invalid'
        })
});