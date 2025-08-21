const createHttpError = require("http-errors");

class LessonRepository {
  constructor() {}

  async fetchLesson(idLesson, client) {
    try {
      const sql = `
      WITH lesson AS (
        SELECT id, title FROM lessons WHERE id = $1
      )
      SELECT
        l.id,
        l.title,
        COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'id', p.id,
              'type', p.type,
              'exp', p.exp,
              'meta', p.meta_json,
              'options', COALESCE(opt.options, '[]'::jsonb)
            )
            ORDER BY p.id
          ) FILTER (WHERE p.id IS NOT NULL),
          '[]'::jsonb
        ) AS problems
      FROM lesson l
      LEFT JOIN problems p ON p.lesson_id = l.id
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(
                 jsonb_build_object('id', s.id, 'label', s.label, 'is_correct', s.is_correct)
                 ORDER BY random()
               ) AS options
        FROM (
          SELECT po.id, po.label, po.is_correct
          FROM problem_options po
          WHERE po.problem_id = p.id
          ORDER BY CASE WHEN p.type='multiple' THEN random() ELSE po.id END
          LIMIT CASE WHEN p.type='multiple' THEN 4 ELSE 1 END
        ) s
      ) opt ON TRUE
      GROUP BY l.id, l.title
    `;

      const { rows } = await client.query(sql, [idLesson]);
      return rows[0] || null;
    } catch (error) {
      if (error instanceof createHttpError.HttpError) throw error;
      throw createHttpError(500, `Internal Server Error: ${error.message}`);
    }
  }

  async findAll(user_id, client) {
    try {
      const sql = `
      SELECT
      a.id,
      a.title,
      a.created_at,
      COALESCE(b.completed, false)       AS completed,
      COALESCE(b.lesson_progress, 0.0)   AS lesson_progress
      FROM lessons a
      LEFT JOIN user_progress b
        ON b.lesson_id = a.id
        AND b.user_id   = $1
      ORDER BY a.id;
    `;

      const { rows } = await client.query(sql, [user_id]);
      return rows;
    } catch (error) {
      throw createHttpError(500, `Internal Server Error: ${error.message}`);
    }
  }

  async add(request, conn) {
    try {
      const sqlScript =
        "INSERT INTO wilayah(kode_wilayah, nama_wilayah) VALUES(?, ?)";
      const [result] = await conn.execute(sqlScript, [
        request.kodeWilayah,
        request.namaWilayah,
      ]);

      if (!result.insertId) {
        throw createHttpError(500, "gagal memasukan data wilayah");
      }

      return {
        Id: result.insertId,
        KodeWilayah: request.kodeWilayah,
        NamaWilayah: request.namaWilayah,
      };
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        throw error;
      }
      throw createHttpError(500, `Internal Server Error: ${error.message}`);
    }
  }
}

module.exports = LessonRepository;
