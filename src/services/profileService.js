const { hasPassedDaysSinceUTC } = require("../helpers");

class ProfileService {
  constructor(repository, db) {
    this.repository = repository;
    this.db = db;
  }

  async findOne(req) {
    const user_id = req.params.id;
    const logger = req.app.locals.logger;
    const client = await this.db.connect();
    try {
      await client.query("BEGIN");
      const result = await this.repository.getUserProfileStats(client, user_id);

      const streakExpired = hasPassedDaysSinceUTC(result.last_streak, 1);

      if (streakExpired) {
        logger.info("Streak Expired");
        logger.info({
          msg: "Updating Streak User",
          params: req.params,
        });
        await this.repository.updateCurrentStreak(client, user_id, 0);
        logger.info({
          msg: "Updating Streak User Completed",
          params: req.params,
        });
      }

      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = ProfileService;
