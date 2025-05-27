const db = require('../config/database');

class Favorite {
  static async create({ userId, word, definition, pronunciation = null }) {
    try {
      const result = await db.query(
        'INSERT INTO favorites (user_id, word, definition, pronunciation) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, word, definition, pronunciation]
      );
      
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('Word already in favorites');
      }
      throw error;
    }
  }

  static async findByUserId(userId, limit = 50, offset = 0) {
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

  static async delete(userId, word) {
    const result = await db.query(
      'DELETE FROM favorites WHERE user_id = $1 AND word = $2 RETURNING *',
      [userId, word]
    );
    
    return result.rows[0];
  }

  static async deleteById(id, userId) {
    const result = await db.query(
      'DELETE FROM favorites WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    
    return result.rows[0];
  }

  static async count(userId) {
    const result = await db.query(
      'SELECT COUNT(*) FROM favorites WHERE user_id = $1',
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
