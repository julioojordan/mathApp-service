const Joi = require("joi");

const answerSchema = Joi.object({
  problem_id: Joi.number().integer().positive().required(),
  option_id: Joi.number().integer().positive(),
  value: Joi.alternatives().try(Joi.number(), Joi.string())
}).xor("option_id", "value");

const submitSchema = Joi.object({
  attempt_id: Joi.string().guid({ version: "uuidv4" }).required(),
  answers: Joi.array().items(answerSchema).min(1).required()
});

module.exports = submitSchema;