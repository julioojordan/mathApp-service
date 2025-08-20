const cacheCorrectAnswers = async (problems, lesson_id, redis, expiry = 0, logger) => {
  for (const prob of problems) {
    try {
      const correct = (prob.options || []).find((o) => o.is_correct === true);
      const key = `problem:correct:${prob.id}`;
      const exists = await redis.exists(key);

      if (exists) {
        logger?.info({
          msg: "[Redis] Key already exists, skipping cache",
          key,
          problem_id: prob.id,
        });
        continue;
      }

      if (correct) {
        if (prob.type === "multiple") {
          await redis.hset(key, {
            lesson_id: lesson_id,
            type: prob.type,
            option_id: String(correct.id),
            label: correct.label,
            exp: prob.exp,
          });

          logger.info({
            msg: "[Redis] Cached multiple-choice correct answer",
            key,
            problem_id: prob.id,
            type: prob.type,
            option_id: correct.id,
            label: correct.label,
            exp: prob.exp,
          });
        } else {
          await redis.hset(key, {
            lesson_id: lesson_id,
            type: prob.type,
            value: String(correct.label).trim(),
            exp: prob.exp,
          });

          logger.info({
            msg: "[Redis] Cached text correct answer",
            key,
            problem_id: prob.id,
            type: prob.type,
            value: correct.label,
            exp: prob.exp,
          });
        }

        if (expiry > 0) {
          await redis.expire(key, expiry);
          logger.info({
            msg: "[Redis] Set expiration for key",
            key,
            expiry,
          });
        }
      } else {
        logger?.warn({
          msg: "[Redis] No correct option found, skipping",
          problem_id: prob.id,
        });
      }
    } catch (error) {
      logger?.warn({
        msg: "[Redis] Failed to cache correct answer",
        error: error.message,
        problem_id: prob?.id,
      });
    }
  }
};

module.exports = cacheCorrectAnswers;
