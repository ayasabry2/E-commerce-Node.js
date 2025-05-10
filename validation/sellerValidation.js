const Joi = require('joi');

exports.createSeller = Joi.object({
    name: Joi.string()
        .required()
        .messages({
            'string.empty': 'Seller name is required',
            'any.required': 'Seller name is required'
        })
});