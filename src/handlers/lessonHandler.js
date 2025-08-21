const handleError = require("../helpers/handleErrorHelper");

class LessonHandler {
  constructor(services) {
    this.lessonService = services.lessonService;
    this.submissionService = services.submissionService;
  }

  async fetchLesson(req, res) {
    const logger = req.app.locals.logger;
    try {
      const lesson = await this.lessonService.fetchLesson(req);
      logger.info({
        msg: "Fetching lesson with problem success",
        params: req.params,
      });

      res.json({ code: 200, status: "Ok", ressponse: lesson });
    } catch (err) {
      return handleError(res, logger, err);
    }
  }

  async findAll(req, res) {
    const logger = req.app.locals.logger;
    try {
      const {user_id} = req.query;

      if (typeof user_id !== "number" || isNaN(user_id)) {
        return res.status(400).json({ error: "Invalid user_id" });
      }

      const lesson = await this.lessonService.findAll(user_id);
      logger.info("Fetching all lessons success");

      res.json({ code: 200, status: "OK", response: lesson });
    } catch (err) {
      return handleError(res, logger, err);
    }
  }

  async submit(req, res) {
    const logger = req.app.locals.logger;
    try {
      const submission = await this.submissionService.submit(req);
      // to do benar kah ini kasih attempt-id
      logger.info("Submmit lesson sukses", { ressponse: req.body });
      logger.info({
        msg: "Submission success",
        ressponse: req.body,
      });
      res.json({ code: 200, status: "Ok", ressponse: submission });
    } catch (err) {
      return handleError(res, logger, err);
    }
  }
}

module.exports = LessonHandler;
