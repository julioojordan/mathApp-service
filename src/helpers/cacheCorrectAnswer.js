const cacheCorrectAnswer = async (redis, data, logger) => {
  try {
    const key = `problem:correct:${data.problem_id}`;
    const exists = await redis.exists(key);

    if (exists) {
      logger.info({
        msg: "[Redis] Key already exists, skipping cache",
        key,
        problem_id: data.problem_id,
      });
      return;
    }

    if (data.type === "multiple") {
      await redis.hset(key, {
        lesson_id: data.lesson_id,
        type: data.type,
        option_id: String(data.id),
        label: data.label,
        exp: data.exp,
      });

      logger.info({
        msg: "[Redis] Cached multiple-choice correct answer",
        key,
        option_id: data.id,
        label: data.label,
        exp: data.exp,
      });
    } else {
      await redis.hset(key, {
        lesson_id: data.lesson_id,
        type: data.type,
        value: String(data.label).trim(),
        exp: data.exp,
      });

      logger.info({
        msg: "[Redis] Cached text correct answer",
        key,
        value: data.label,
        exp: data.exp,
      });
    }
  } catch (error) {
    logger.warn({
      msg: "[Redis] Failed to cache correct answer",
      error: error.message,
      problem_id: data?.problem_id,
      type: data?.type,
    });
  }
};

module.exports = cacheCorrectAnswer;
