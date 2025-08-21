const Joi = require("joi");

const lessonQuerySchema = Joi.object({
  user_id: Joi.number().integer().required().messages({
    'any.required': 'user_id is required',
    'number.base': 'user_id must be a number',
    'number.integer': 'user_id must be an integer',
  }),
});

module.exports = lessonQuerySchema;
