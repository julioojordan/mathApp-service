const handleError = require("../helpers/handleErrorHelper");

class LessonHandler {
  constructor(lessonService) {
    this.lessonService = lessonService;
  }

  async fetchLesson(req, res) {
    const logger = req.app.locals.logger;
    try {
      const lesson = await this.lessonService.fetchLesson(req);
      logger.info("Fetching lesson with problem success", {
        params: req.params,
      });
      res.json({ code: 200, status: "Ok", data: lesson });
    } catch (err) {
      return handleError(res, logger, err);
    }
  }

  async findAll(req, res) {
    const logger = req.app.locals.logger;
    try {
      const idUser = req.query.idUser;

      if (typeof idUser !== "number" || isNaN(idUser)) {
        return res.status(400).json({ error: "Invalid idUser" });
      }

      const lesson = await this.lessonService.findAll(idUser);
      logger.info("Fetching all lessons success");

      res.json({ code: 200, status: "OK", data: lesson });
    } catch (err) {
      return handleError(res, logger, err);
    }
  }

  async add(req, res) {
    const logger = req.app.locals.logger;
    try {
      const lesson = await this.lessonService.add(req.body);
      // to do benar kah ini kasih attempt-id
      logger.info("Submmit lesson sukses", { data: req.body });
      res.json({ code: 200, status: "Ok", data: lesson });
    } catch (err) {
      return handleError(res, logger, err);
    }
  }
}

module.exports = LessonHandler;
