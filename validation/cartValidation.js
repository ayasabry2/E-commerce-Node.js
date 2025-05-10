const Joi = require('joi');

exports.addToCart = Joi.object({
  productId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Product ID is invalid',
      'any.required': 'Product ID is required',
    }),
  quantity: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'Quantity must be a number',
      'number.min': 'Quantity must be at least 1',
    }),
});

exports.updateCart = Joi.object({
  productId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Product ID is invalid',
      'any.required': 'Product ID is required',
    }),
});