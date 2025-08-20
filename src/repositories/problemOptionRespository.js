const createHttpError = require("http-errors");

class ProblemOptionRepository {
  constructor() {}

  async getAllOptionById(client, problem_id) {
    try {
      const sql = `SELECT 
      a.id, 
      a.problem_id, 
      a.label,
      a.is_correct,
      b.exp,
      b.type,
      c.id AS lesson_id
      FROM problem_options a JOIN
      problems b ON
      a.problem_id = b.id
      JOIN lessons c ON
      b.lesson_id = c.id
      WHERE b.id = $1`;

      const { rows } = await client.query(sql, [problem_id]);
      return rows || null;
    } catch (error) {
      if (error instanceof createHttpError.HttpError) throw error;
      throw createHttpError(500, `Internal Server Error: ${error.message}`);
    }
  }


}

module.exports = ProblemOptionRepository;
