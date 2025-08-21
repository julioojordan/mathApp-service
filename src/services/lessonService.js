const {
  cacheTotalProblem,
  cacheCorrectAnswers,
  deleteUserProgress,
} = require("../helpers");

class LessonService {
  constructor(repository, db) {
    this.repository = repository;
    this.db = db;
  }

  async fetchLesson(req) {
    const lesson_id = req.params.id;
    const { user_id } = req.query;
    const { logger, redis } = req.app.locals;
    const client = await this.db.connect();
    try {
      await deleteUserProgress(redis, user_id, lesson_id, logger);
      await client.query("BEGIN");

      const result = await this.repository.fetchLesson(lesson_id, client);

      await client.query("COMMIT");

      if (Array.isArray(result.problems)) {
        const ttl = parseInt(process.env.REDIS_PROBLEM_TTL || "0", 10);
        await cacheCorrectAnswers(
          result.problems,
          result.id,
          redis,
          ttl,
          logger
        );
        await cacheTotalProblem(
          redis,
          result.problems.length,
          result.id,
          logger
        );

        result.problems = result.problems.map((p) => ({
          ...p,
          options: (p.options || []).map(({ is_correct, ...rest }) => rest),
        }));
      }
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async findAll(user_id) {
    const client = await this.db.connect();
    try {
      await client.query("BEGIN");

      const result = await this.repository.findAll(user_id, client);

      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async add(data) {
    const client = await this.db.connect();
    try {
      await client.query("BEGIN");

      const result = await this.repository.add(data, client);

      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = LessonService;
