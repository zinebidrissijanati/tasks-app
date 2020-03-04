const Joi = require('@hapi/joi');
const ValidationException = use('App/Exceptions/ValidationException');
const rules = {
    title: Joi.string()
        .min(10)
        .max(30)
        .required(),
    date: Joi.date().iso().required(),
    description: Joi.string(),
    sequenceNumber: Joi.number().min(1).max(3).required(),
    createdBy: Joi.string()
    .alphanum()
    .length(3)
    .required(),
    createdAt: Joi.date().iso().required(),
};
const schema = Joi.object(rules);
const validateOrThrow = (task) => {
    const validation = schema.validate(task);
  
    if (validation.error) {
      throw new ValidationException(validation.error);
    }
  };
  
  
  module.exports = {
    validateOrThrow,
  };