const Joi = require('@hapi/joi');
const ValidationException = use('App/Exceptions/ValidationException');
const rules = {
    name: Joi.string().max(30).required(),
    ref: Joi.string()
    .alphanum()
    .length(3)
    .required(),
    profile: {
        role: Joi.any().valid(
          'admin', 'user_1', 'user_2',
        ).required(),
      },
    createdBy: Joi.string()
    .alphanum()
    .length(3)
    .required(),
    createdAt: Joi.date().iso().required(),

};
const schema = Joi.object(rules);


const validateOrThrow = (user) => {
  const validation = schema.validate(user);

  if (validation.error) {
    throw new ValidationException(validation.error);
  }
};


module.exports = {
  validateOrThrow,
};
