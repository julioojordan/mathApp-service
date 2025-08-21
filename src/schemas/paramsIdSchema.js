const Joi = require("joi");

const paramsIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .required()
    .messages({
      'any.required': 'id is required',
      'number.base': 'id must be a number',
      'number.integer': 'id must be an integer',
    }),
});

module.exports = paramsIdSchema;