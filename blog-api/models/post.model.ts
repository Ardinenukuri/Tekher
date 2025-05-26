import pool from '../config/db';

interface Post {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

class PostModel {
  static async create(title: string, content: string, userId: number): Promise<Post> {
    const { rows } = await pool.query(
      'INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, content, userId]
    );
    return rows[0];
  }

  static async findAll(): Promise<Post[]> {
    const { rows } = await pool.query('SELECT * FROM posts');
    return rows;
  }

  static async findById(id: number): Promise<Post | null> {
    const { rows } = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    return rows[0] || null;
  }

  static async update(id: number, title: string, content: string): Promise<Post | null> {
    const { rows } = await pool.query(
      'UPDATE posts SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [title, content, id]
    );
    return rows[0] || null;
  }

  static async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM posts WHERE id = $1', [id]);
  }

  static async findByUserId(userId: number): Promise<Post[]> {
    const { rows } = await pool.query('SELECT * FROM posts WHERE user_id = $1', [userId]);
    return rows;
  }
}

export default PostModel;