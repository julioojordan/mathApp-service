const createHttpError = require("http-errors");

class UserRepository {
  constructor() {
  }

  async findOne(idWilayah, conn) {
    try {
      const sqlScript = "SELECT id as Id, kode_wilayah as KodeWilayah, nama_wilayah as NamaWilayah FROM wilayah WHERE id = ?";
      const [rows] = await conn.execute(sqlScript, [idWilayah]);

      if (rows.length === 0) {
        throw createHttpError(404, "Wilayah tidak Ditemukan");
      }

      return rows[0];
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Internal Server Error: ${error.message}`);
    }
  }
}

module.exports = UserRepository;
