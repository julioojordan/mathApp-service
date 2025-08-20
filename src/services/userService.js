class UserService {
    constructor(repository, db) {
        this.repository = repository;
        this.db = db;
    }

    async findOne(idLesson) {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await this.repository.findOne(idLesson, connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = UserService;
