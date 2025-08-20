const handleError = require("../helpers/handleErrorHelper");

class ProblemHandler {
  constructor(problemService) {
    this.problemService = problemService;
  }

  async getCorrectAnswer(req, res) {
    const logger = req.app.locals.logger;
    try {
      const { is_correct, exp } = await this.problemService.getCorrectAnswer(req);
      logger.info("Fetching correct Answer success", { params: req.params });
      res
        .status(200)
        .json({ success: true, is_correct, earned_exp: is_correct ? exp : 0 });
    } catch (err) {
      return handleError(res, logger, err);
    }
  }
}

module.exports = ProblemHandler;
