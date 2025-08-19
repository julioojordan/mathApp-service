const cors = require("cors");
const { submitSchema } = require("../schemas");
const { validateSchema } = require("../middlewares");

const setupRoutes = (app, logger) => {
  app.use(cors());

  app.post("/submit", validateSchema(submitSchema), (req, res) => {
    const { attempt_id, answers } = req.validated;
    res.json({
      ok: true,
      attempt_id,
      total_answers: answers.length,
    });
  });

  logger.info("Routes setup completed!!");
};

module.exports = setupRoutes;
