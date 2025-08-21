class ProfileService {
  constructor(repository, db) {
    this.repository = repository;
    this.db = db;
  }

  async findOne(id_user) {
    const client = await this.db.connect();
    try {
      await client.query("BEGIN");
      const result = await this.repository.getUserProfileStats(client, id_user );
      
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
