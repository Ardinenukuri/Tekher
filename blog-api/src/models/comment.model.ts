import pool from '../config/db';

interface Comment {
  id: number;
  content: string;
  user_id: number;
  post_id: number;
  created_at: Date;
  updated_at: Date;
}

class CommentModel {
  static async findById(id: number): Promise<Comment | null> {
  const { rows } = await pool.query(`SELECT * FROM comments WHERE id = $1`, [id]);
  return rows[0] || null;
}

  static async create(content: string, userId: number, postId: number): Promise<Comment> {
    const { rows } = await pool.query(
      `INSERT INTO comments (content, user_id, post_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [content, userId, postId]
    );
    return rows[0];
  }

  static async findByPostId(postId: number): Promise<Comment[]> {
    const { rows } = await pool.query(
      `SELECT c.*, u.username as author_name 
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = $1
       ORDER BY c.created_at ASC`,
      [postId]
    );
    return rows;
  }

  static async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM comments WHERE id = $1', [id]);
  }

  static async update(id: number, content: string): Promise<Comment> {
    const { rows } = await pool.query(
      `UPDATE comments
       SET content = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [content, id]
    );
    return rows[0];
  }
}

export default CommentModel;
