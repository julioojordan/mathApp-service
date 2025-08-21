const createHttpError = require("http-errors");

class UserRepository {
  constructor() {}

  async getUserProfileStats(client, user_id) {
    try {
      const sql = `
      WITH total_problems AS (
        SELECT COUNT(*) AS total FROM problems
      ),
      progress_per_problem AS (
        SELECT 
          up.user_id,
          up.lesson_id,
          up.lesson_progress,
          COUNT(p.id) AS lesson_problem_count
        FROM user_progress up
        JOIN problems p ON p.lesson_id = up.lesson_id
        WHERE up.user_id = $1
        GROUP BY up.user_id, up.lesson_id, up.lesson_progress
      )
      SELECT 
        u.id,
        u.name,
        u.exp,
        u.current_streak,
        u.best_streak,
        u.last_streak,
        COALESCE(
          SUM(pp.lesson_progress * pp.lesson_problem_count) / NULLIF(tp.total, 0) * 100,
          0
        ) AS progress_percentage
      FROM users u
      LEFT JOIN progress_per_problem pp ON pp.user_id = u.id
      CROSS JOIN total_problems tp
      WHERE u.id = $1
      GROUP BY u.id, tp.total;
    `;

      const { rows } = await client.query(sql, [user_id]);
      return rows?.[0] || null;
    } catch (error) {
      if (error instanceof createHttpError.HttpError) throw error;
      throw createHttpError(500, `Internal Server Error: ${error.message}`);
    }
  }

  async updateUser(client, data, redisData) {
    const { new_total_xp, current_streak, best_streak, user_id } = data;
    const { correct_count } = redisData;

    const new_current_streak =
      Number(current_streak) + Number(correct_count);
    const new_best_streak =
      new_current_streak > Number(best_streak)
        ? new_current_streak
        : Number(best_streak);

    try {
      const fields = [
        `exp = $1`,
        `current_streak = $2`,
        `best_streak = $3`,
      ];
      const values = [
        Number(new_total_xp),
        new_current_streak,
        new_best_streak,
      ];

      if (correct_count >= 1) {
        fields.splice(3, 0, `last_streak = NOW()`);
      }

      values.push(user_id);

      const updateSql = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE id = $${values.length}
      RETURNING id, exp, current_streak, best_streak, last_streak;
    `;

      const { rows } = await client.query(updateSql, values);

      if (rows.length === 0) {
        throw createHttpError(404, `User with id ${user_id} not found`);
      }

      return {
        id: rows[0].id,
        exp: rows[0].exp,
        current_streak: rows[0].current_streak,
        best_streak: rows[0].best_streak,
        last_streak: rows[0].last_streak,
      };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) throw error;
      throw createHttpError(
        500,
        `Internal Server Error (updateUser): ${error.message}`
      );
    }
  }
}

module.exports = UserRepository;
