const createHttpError = require("http-errors");

class ProblemRepository {
  constructor() {}

  async countProblemByLessonId(client, lesson_id) {
    try {
      const sql = `SELECT COUNT(*) as total FROM problems WHERE lesson_id = $1`;
      const { rows } = await client.query(sql, [lesson_id]);
      return Number(rows?.[0]?.total || 0);
    } catch (error) {
      if (error instanceof createHttpError.HttpError) throw error;
      throw createHttpError(500, `Internal Server Error: ${error.message}`);
    }
  }
}

module.exports = ProblemRepository;
