const {
  checkCorrectAnswer,
  updateUserProgress,
  cacheTotalProblem,
  cacheCorrectAnswer,
  getIsCorrect,
} = require("../helpers");

class ProblemService {
  constructor(repository, db) {
    this.problemOptionrepository = repository.problemOptionRepository;
    this.problemrepository = repository.problemRepository;
    this.db = db;
  }

  async getCorrectAnswer(req) {
    const client = await this.db.connect();
    try {
      const lesson_id = req.params.id;
      const body = req.body;
      const { redis, logger } = req.app.locals;
      let { is_correct, exp, is_miss_cache } = await checkCorrectAnswer(
        redis,
        lesson_id,
        body,
        logger
      );
      let totalProblem;

      if (is_miss_cache) {
        await client.query("BEGIN");
        const result = await this.problemOptionrepository.getAllOptionById(
          client,
          body.problem_id
        );
        totalProblem = await this.problemrepository.countProblemByLessonId(
          client,
          lesson_id
        );

        await client.query("COMMIT");

        const correctAnswer = result.filter((item) => item.is_correct === true);
        await cacheCorrectAnswer(redis, correctAnswer[0], logger);
        await cacheTotalProblem(
          redis,
          totalProblem,
          correctAnswer[0].lesson_id,
          logger
        );

        //check is correct
        const questionType = correctAnswer[0]?.type || "multiple";
        is_correct = getIsCorrect(
          questionType,
          correctAnswer,
          body
        );
        exp = is_correct ? correctAnswer[0]?.exp || 0 : 0;
        exp = parseInt(exp);
      } else {
        const totalStr = await redis.get(`lesson:totalProblem:${lesson_id}`);
        totalProblem = parseInt(totalStr) || 1;
      }

      const { attempt_id } = await updateUserProgress(
        redis,
        {
          user_id: body.user_id,
          lesson_id,
          is_correct,
          exp,
          problem_id: body.problem_id,
          request_body: body,
        },
        totalProblem,
        logger
      );
      return { is_correct, exp, attempt_id };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = ProblemService;
