const Joi = require('joi');

exports.register = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Invalid email format',
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty'
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required',
            'string.empty': 'Password cannot be empty'
        }),
    name: Joi.string()
        .required()
        .messages({
            'string.empty': 'Name cannot be empty',
            'any.required': 'Name is required'
        }),
    isSeller: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'isSeller must be a boolean'
        })
});

exports.login = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Invalid email format',
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty'
        }),
    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required',
            'string.empty': 'Password cannot be empty'
        })
});

exports.updateUser = Joi.object({
    email: Joi.string()
        .email()
        .optional()
        .messages({
            'string.email': 'Invalid email format',
            'string.empty': 'Email cannot be empty'
        }),
    name: Joi.string()
        .optional()
        .messages({
            'string.empty': 'Name cannot be empty'
        }),
    password: Joi.string()
        .min(6)
        .optional()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'string.empty': 'Password cannot be empty'
        })
});

exports.forgotPassword = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Invalid email format',
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty'
        })
});