const cors = require("cors");
const { submitSchema } = require("../schemas");
const { validateSchema, castIdToInt } = require("../middlewares");

const setupRoutes = (app, logger) => {
  app.use(cors());

  app.get("/api/lessons", castIdToInt, async (req, res) => {
    try {
      const { lessonHandler } = req.app.locals.handlers;
      await lessonHandler.findAll(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/lesson/:id", castIdToInt, async (req, res) => {
    try {
      const { lessonHandler } = req.app.locals.handlers;
      await lessonHandler.fetchLesson(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/lesson/:id/check", castIdToInt, async (req, res) => {
    try {
      const { problemHandler } = req.app.locals.handlers;
      await problemHandler.getCorrectAnswer(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // to do ini perlu tambahkan validate query sepertinya
  app.post(
    "/api/lessons/:id/submit",
    validateSchema(submitSchema),
    castIdToInt,
    async (req, res) => {
      // ada query param : current streak, exp, lesson_progress (ini global ya bukan 1 per 1 ?), lesson_id
      try {
        const { attempt_id, answers } = req.validated;
        const { lessonHandler } = req.app.locals.handlers;
        await lessonHandler.submit(req, res);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  );

  app.get("/api/profile/:id", async (req, res) => {
    try {
      const { profileHandler } = req.app.locals.handlers;
      await profileHandler.findOne(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  logger.info("Routes setup completed!!");
};

module.exports = setupRoutes;
