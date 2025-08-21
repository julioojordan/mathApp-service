const checkCorrectAnswer = require("./checkCorrectAnswer");
const updateUserProgress = require("./updateUserProgress");
const cacheCorrectAnswer = require("./cacheCorrectAnswer");
const cacheCorrectAnswers = require("./cacheCorrectAnswers");
const cacheTotalProblem = require("./cacheTotalProblem");
const validateAnswer = require("./validateAnswer");
const getIsCorrect = require("./getIsCorrect");

module.exports = {
  checkCorrectAnswer,
  updateUserProgress,
  cacheTotalProblem,
  cacheCorrectAnswer,
  cacheCorrectAnswers,
  validateAnswer,
  getIsCorrect
};
