const Joi = require("joi");

const checkAnswerSchema = Joi.object({
  user_id: Joi.number().integer().required().messages({
    'any.required': 'user_id is required',
    'number.base': 'user_id must be a number',
    'number.integer': 'user_id must be an integer',
  }),
  problem_id: Joi.number().integer().required().messages({
    'any.required': 'problem_id is required',
    'number.base': 'problem_id must be a number',
    'number.integer': 'problem_id must be an integer',
  }),
  value: Joi.string().messages({
    'string.base': 'value must be a string',
  }),
  option_id: Joi.number().integer().messages({
    'number.base': 'option_id must be a number',
    'number.integer': 'option_id must be an integer',
  }),
}).xor("value", "option_id").messages({
  "object.missing": "Either value or option_id is required",
  "object.xor": "Only one of value or option_id should be provided",
});


module.exports = checkAnswerSchema