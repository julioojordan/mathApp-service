async function deleteUserProgress(redis, user_id, lesson_id, logger) {
  try {
    const attemptKey = `attempt:${user_id}:${lesson_id}`;
    const attemptDeleted = await redis.unlink(attemptKey);

    const pattern = `answered:${user_id}:${lesson_id}:*`;
    let cursor = "0";
    let answeredDeleted = 0;

    do {
      const [nextCursor, foundKeys] = await redis.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        500
      );
      cursor = nextCursor;

      if (foundKeys.length > 0) {
        const d = await redis.unlink(...foundKeys);
        answeredDeleted += d;
      }
    } while (cursor !== "0");

    logger.info({
      msg: "[Redis] User progress deleted",
      user_id,
      lesson_id,
      attempt_deleted: attemptDeleted,
      answered_deleted: answeredDeleted,
    });
  } catch (err) {
    logger.error(err, {
      msg: "[Redis] Error during deleteUserProgress",
      user_id,
      lesson_id,
    });
  }
}

module.exports = deleteUserProgress;
