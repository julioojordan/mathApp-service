const cors = require("cors");
const {
  submitSchema,
  lessonQuerySchema,
  paramsIdSchema,
  checkAnswerSchema,
} = require("../schemas");
const { validateSchema, castIdToInt } = require("../middlewares");

const setupRoutes = (app, logger) => {
  app.use(cors());

  app.get(
    "/api/lessons",
    castIdToInt,
    validateSchema(lessonQuerySchema, "query"),
    async (req, res) => {
      try {
        const { lessonHandler } = req.app.locals.handlers;
        await lessonHandler.findAll(req, res);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  );

  app.get(
    "/api/lesson/:id",
    castIdToInt,
    validateSchema(paramsIdSchema, "params"),
    async (req, res) => {
      try {
        const { lessonHandler } = req.app.locals.handlers;
        await lessonHandler.fetchLesson(req, res);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  );

  app.post(
    "/api/lesson/:id/check",
    castIdToInt,
    validateSchema(paramsIdSchema, "params"),
    validateSchema(checkAnswerSchema, "body"),
    async (req, res) => {
      try {
        const { problemHandler } = req.app.locals.handlers;
        await problemHandler.getCorrectAnswer(req, res);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  );

  app.post(
    "/api/lessons/:id/submit",
    validateSchema(paramsIdSchema, "params"),
    validateSchema(submitSchema),
    castIdToInt,
    async (req, res) => {
      try {
        const { lessonHandler } = req.app.locals.handlers;
        await lessonHandler.submit(req, res);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  );

  app.get(
    "/api/profile/:id",
    validateSchema(paramsIdSchema, "params"),
    async (req, res) => {
      try {
        const { profileHandler } = req.app.locals.handlers;
        await profileHandler.findOne(req, res);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  );

  logger.info("Routes setup completed!!");
};

module.exports = setupRoutes;
