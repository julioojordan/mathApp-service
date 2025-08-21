const createHttpError = require("http-errors");

class SubmissionRepository {
  constructor() {}

  async insertSubmission(client, data) {
    const { user_id, lesson_id, attempt_id, meta_json } = data;
    const cleanedMetaJson = JSON.stringify(meta_json);
    try {
      const sql = `
      INSERT INTO submissions (user_id, lesson_id, attempt_id, meta_json)
      VALUES ($1, $2, $3, $4)
      RETURNING id, submitted_at
    `;

      const values = [user_id, lesson_id, attempt_id, cleanedMetaJson];
      const { rows } = await client.query(sql, values);

      return {
        submission_id: rows[0].id,
        submitted_at: rows[0].submitted_at,
        attempt_id,
        meta: meta_json,
      };
    } catch (error) {
      if (error.code === "23505") {
        throw createHttpError(409, {
          error: "DuplicateAttempt",
          message: "This attempt_id was already processed",
        });
      }

      if (error instanceof createHttpError.HttpError) {
        throw error;
      }

      throw createHttpError(500, `Internal Server Error: ${error.message}`);
    }
  }
}

module.exports = SubmissionRepository;
