const createHttpError = require("http-errors");
const { validateAnswer } = require("../helpers");

class SubmissionService {
  constructor(repository, db) {
    this.userProgressRepository = repository.userProgressRepository;
    this.submissionRepository = repository.submissionRepository;
    this.userRepository = repository.userRepository;
    this.db = db;
  }

  async submit(req) {
    const client = await this.db.connect();
    const { current_streak, best_streak, exp, user_id } = req.query;
    const lesson_id = req.params.id
    const { redis } = req.app.locals;
    const progressKey = `attempt:${user_id}:${lesson_id}`;
    try {
      // get data from redis
      const progressData = await redis.hgetall(progressKey);
      if (
        !progressData.attempt_id ||
        progressData.attempt_id !== req.body.attempt_id
      ) {
        throw createHttpError(409, "Invalid or mismatched attempt_id.");
      }

      //get meta data from redis -> to cross check jawaban
      const metaStr = await redis.hget(progressKey, "meta_json");
      let meta_json;
      try {
        meta_json = JSON.parse(metaStr);
      } catch (err) {
        throw createHttpError(500, "Failed to parse meta_json from Redis.");
      }

      //validate answer
      if (!validateAnswer(meta_json, req.body.answers)) {
        throw createHttpError(409, {
          error: "AnswerMismatch",
          message: "Submitted answers do not match the recorded attempt data.",
        });
      }

      // begin adding data to db
      await client.query("BEGIN");
      await this.submissionRepository.insertSubmission(client, {
        user_id,
        lesson_id,
        attempt_id: req.body.attempt_id,
        meta_json,
      });
      await this.userProgressRepository.insertOne(
        client,
        {
          user_id,
          lesson_id,
        },
        progressData
      );

      //TO DO update user streak dll
      const new_total_xp = Number(progressData.earned_exp) + Number(exp);
      const resUpdate = await this.userRepository.updateUser(
        client,
        {
          current_streak,
          best_streak,
          new_total_xp,
          user_id,
        },
        progressData
      );

      // parse progress
      let progress = parseFloat(progressData.lesson_progress);
      if (isNaN(progress)) {
        progress = 0;
      } else {
        progress = Math.min(1, Math.max(0, progress / 100));
      }

      await client.query("COMMIT");
      return {
        correct_count: parseInt(progressData.correct_count),
        earned_exp: parseInt(progressData.earned_exp),
        new_total_xp,
        streak: {
          current: resUpdate.current_streak,
          best: resUpdate.best_streak,
        },
        lesson_progress: progress,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = SubmissionService;
