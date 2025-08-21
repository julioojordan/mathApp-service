const Joi = require("joi");

const answerSchema = Joi.object({
  problem_id: Joi.number().integer().positive().required(),
  option_id: Joi.number().integer().positive(),
  value: Joi.alternatives().try(Joi.number(), Joi.string()),
}).xor("option_id", "value");

const submitSchema = Joi.object({
  attempt_id: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "any.required": "attempt_id is required",
    "string.guid": "attempt_id must be a valid UUID",
  }),
  answers: Joi.array().items(answerSchema).min(1).required().messages({
    "array.min": "answers must be non-empty",
    "any.required": "answers field is required",
  }),
});

module.exports = submitSchema;
