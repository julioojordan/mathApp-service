const cacheTotalProblem = async (redis, newTotal, lesson_id, logger) => {
  const key = `lesson:totalProblem:${lesson_id}`;

  try {
    const existingTotal = await redis.get(key);

    if (!existingTotal) {
      await redis.set(key, newTotal);
      logger.info({
        msg: "[Redis] Set total problem for lesson",
        key,
        lesson_id,
        total: newTotal,
      });
    } else {
      const currentTotal = parseInt(existingTotal);

      if (currentTotal !== newTotal) {
        await redis.set(key, newTotal);
        logger.info({
          msg: "[Redis] Updated total problem for lesson",
          key,
          lesson_id,
          old_total: currentTotal,
          new_total: newTotal,
        });
      } else {
        logger.debug({
          msg: "[Redis] Total problem is already up-to-date",
          key,
          lesson_id,
          total: currentTotal,
        });
      }
    }
  } catch (error) {
    logger.error({
      msg: "[Redis] Failed to cache total problem for lesson",
      key,
      lesson_id,
      error: error.message,
    });
  }
};

module.exports = cacheTotalProblem;
