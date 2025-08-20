const { v4: uuidv4 } = require("uuid");

const updateUserProgress = async (
  redis,
  { user_id, lesson_id, is_correct, exp, problem_id },
  totalProblem,
  logger
) => {
  const progressKey = `attempt:${user_id}:${lesson_id}`;
  const userAnswerKey = `answered:${user_id}:${lesson_id}:${problem_id}`;
  let attempt_id;

  try {
    const alreadyAnswered = await redis.exists(userAnswerKey);
    if (alreadyAnswered) {
      logger.info({
        msg: "[Redis] Question already answered by user. Skipping update.",
        user_id,
        lesson_id,
        problem_id: problem_id,
      });
      return { attempt_id: await redis.hget(progressKey, "attempt_id") };
    }
    await redis.set(userAnswerKey, 1);

    const exists = await redis.exists(progressKey);

    if (!exists) {
      attempt_id = uuidv4();
      await redis.hmset(progressKey, {
        attempt_id,
        count: 1,
        correct_count: is_correct ? 1 : 0,
        earned_exp: is_correct ? exp : 0,
      });

      logger.info({
        msg: "[Redis] Initialized new attempt progress",
        progressKey,
        attempt_id,
        is_correct,
        exp,
      });
    } else {
      await redis.hincrby(progressKey, "count", 1);

      if (is_correct) {
        await redis.hincrby(progressKey, "correct_count", 1);
        await redis.hincrby(progressKey, "earned_exp", exp);
      }

      attempt_id = await redis.hget(progressKey, "attempt_id");

      logger.info({
        msg: "[Redis] Updated existing attempt progress",
        progressKey,
        attempt_id,
        is_correct,
        exp,
      });
    }

    const current = await redis.hgetall(progressKey);
    const count = parseInt(current.count || 0, 10);
    const total = totalProblem > 0 ? totalProblem : 1;
    const progress = Math.min(100, Math.round((count / total) * 100));

    await redis.hset(progressKey, "lesson_progress", progress);

    logger.info({
      msg: "[Redis] Updated lesson progress",
      progressKey,
      attempt_id,
      count,
      total,
      lesson_progress: progress,
    });

    return { attempt_id };
  } catch (error) {
    logger.error(error, {
      msg: "[Redis] Error updating user progress",
      user_id,
      lesson_id,
      progressKey,
    });
  }
};

module.exports = updateUserProgress;
