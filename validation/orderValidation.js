const Joi = require('joi');

exports.createOrder = Joi.object({
    products: Joi.array()
        .min(1)
        .items(
            Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .messages({
                    'string.pattern.base': 'Product ID is invalid'
                })
        )
        .required()
        .messages({
            'array.min': 'At least one product is required',
            'any.required': 'Products are required'
        })
});
