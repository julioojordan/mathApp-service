const createError = require("http-errors");

const checkCorrectAnswer = async (redis, lesson_id, data, logger) => {
  const problemKey = `problem:correct:${data.problem_id}`;
  const totalProblemKey = `lesson:totalProblem:${lesson_id}`;

  try {
    const hash = await redis.hgetall(problemKey);
    const hashTotal = await redis.get(totalProblemKey);

    if (!hash || Object.keys(hash).length === 0 || !hash.type) {
      logger.info({
        msg: "[Redis] problem:correct key not found or incomplete",
        problemKey,
        problem_id: data.problem_id,
        hash,
      });
      return { is_correct: false, exp: 0, is_miss_cache: true };
    }

    if (!hashTotal) {
      logger.info({
        msg: "[Redis] lesson:totalProblem key not found",
        totalProblemKey,
        lesson_id,
      });
      return { is_correct: false, exp: 0, is_miss_cache: true };
    }

    if (String(hash.lesson_id) !== String(lesson_id)) {
      logger.warn({
        msg: "[Redis] lesson_id mismatch with cached problem data",
        expected_lesson_id: hash.lesson_id,
        actual_lesson_id: lesson_id,
        problem_id: data.problem_id,
      });
      throw createError(400, "Mismatch between provided lesson_id and cached lesson_id.");
    }

    const type = hash.type;
    const exp = Number(hash.exp || 0);

    if (type === "multiple") {
      const correctOptionId = hash.option_id;
      const ok = String(data.option_id) === String(correctOptionId);

      logger.info({
        msg: "[Redis] Multiple-choice answer checked",
        is_correct: ok,
        user_option: data.option_id,
        correct_option: correctOptionId,
        exp: ok ? exp : 0,
      });

      return { is_correct: ok, exp: ok ? exp : 0, is_miss_cache: false };
    }

    const normalize = (v) =>
      String(v ?? "")
        .trim()
        .toLowerCase();

    const correctValue = normalize(hash.value);
    const userValue = normalize(data.value);
    const ok = userValue === correctValue;

    logger.info({
      msg: "[Redis] Text answer checked",
      is_correct: ok,
      user_value: userValue,
      correct_value: correctValue,
      exp: ok ? exp : 0,
    });

    return { is_correct: ok, exp: ok ? exp : 0, is_miss_cache: false };
  } catch (err) {
    logger.error(err, {
      msg: "[Redis] Error during checkCorrectAnswer",
      lesson_id,
      data,
    });
  }
};

module.exports = checkCorrectAnswer;
