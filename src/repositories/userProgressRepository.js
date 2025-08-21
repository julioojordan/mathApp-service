const createHttpError = require("http-errors");

class UserProgressRepository {
  constructor() {}

  async insertOne(client, data, redisData) {
    const { user_id, lesson_id } = data;
    const { earned_exp, lesson_progress, meta_json } = redisData;

    const progressValue = Math.min(1, parseFloat(lesson_progress) / 100);

    try {
      // TO DO ON CLONFLICT if ada yang user_id dan lesson_id sama di update saja
      const sql = `
        INSERT INTO user_progress (
          user_id, lesson_id, completed, lesson_progress, earned_exp, meta_json
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (user_id, lesson_id)
        DO UPDATE SET
          lesson_progress = EXCLUDED.lesson_progress,
          earned_exp = EXCLUDED.earned_exp,
          completed = EXCLUDED.completed,
          meta_json = EXCLUDED.meta_json,
          updated_at = now()
        RETURNING *;
      `;

      const values = [
        user_id,
        lesson_id,
        progressValue === 1,
        progressValue,
        parseInt(earned_exp),
        meta_json,
      ];

      const { rows } = await client.query(sql, values);

      return rows[0];
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }

      throw createHttpError(500, `Internal Server Error: ${error.message}`);
    }
  }

  async isProgressExist(client, user_id, lesson_id) {
    try {
      const sql = `
      SELECT COUNT(*) AS total
      FROM user_progress
      WHERE user_id = $1 AND lesson_id = $2
    `;

      const { rows } = await client.query(sql, [user_id, lesson_id]);

      if (!rows || rows.length === 0) {
        throw createHttpError(500, {
          error: "Unexpected Error",
          message: "Failed to count progress data",
        });
      }

      const total = Number(rows[0].total || 0);
      return total >= 1;
    } catch (error) {
      if (error instanceof createHttpError.HttpError) throw error;
      throw createHttpError(500, `Internal Server Error: ${error.message}`);
    }
  }
}

module.exports = UserProgressRepository;
