import Joi from 'joi';

export const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().regex(/^[a-zA-Z\s]+$/).min(3).max(30).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        contactNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
        password: Joi.string().min(8).required()
    });

    return schema.validate(data);
}

export const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string().min(8).required(),
    });

    return schema.validate(data);
}
