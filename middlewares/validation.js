const AppError = require('../utils/AppError');

exports.validation = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(
            { ...req.body, ...req.params, ...req.query },
            { abortEarly: false, allowUnknown: true }
        );
        if (error) {
            
            const errorMessages = error.details
                .map(detail => {
                    if (detail.type === 'any.required' && detail.context.value !== undefined) {
                        return null; 
                    }
                    return detail.message;
                })
                .filter(msg => msg !== null)
                .join(', ');
            return next(new AppError(422, errorMessages || 'Validation failed'));
        }
        next();
    };
};