const db = require('./database');

class Favorite {
  static async create({ userId, word, definition, pronunciation, wordData }) {
    const result = await db.query(
      'INSERT INTO favorites (user_id, word, definition, pronunciation, word_data) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, word, definition, pronunciation, wordData ? JSON.stringify(wordData) : null]
    );
    
    return result.rows[0];
  }

  static async findByUserId(userId, limit = 20, offset = 0) {
    const result = await db.query(
      'SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );
    
    return result.rows;
  }

  static async findByUserIdAndWord(userId, word) {
    const result = await db.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND word = $2',
      [userId, word]
    );
    
    return result.rows[0];
  }

  static async deleteByUserIdAndWord(userId, word) {
    const result = await db.query(
      'DELETE FROM favorites WHERE user_id = $1 AND word = $2 RETURNING *',
      [userId, word]
    );
    
    return result.rows[0];
  }

  static async deleteById(userId, id) {
    const result = await db.query(
      'DELETE FROM favorites WHERE user_id = $1 AND id = $2 RETURNING *',
      [userId, id]
    );
    
    return result.rows[0];
  }

  static async count(userId) {
    const result = await db.query(
      'SELECT COUNT(*) as count FROM favorites WHERE user_id = $1',
      [userId]
    );
    
    return parseInt(result.rows[0].count);
  }

  static async search(userId, searchTerm, limit = 20) {
    const result = await db.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND (word ILIKE $2 OR definition ILIKE $2) ORDER BY created_at DESC LIMIT $3',
      [userId, `%${searchTerm}%`, limit]
    );
    
    return result.rows;
  }
}

module.exports = Favorite;
