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
  static async update(id: number, title: string, content: string): Promise<any> {
  try {
    // First update the post
    const updatePost = await pool.query(
      'UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *',
      [title, content, id]
    );

    // Then return the updated post
    if (updatePost.rowCount === 0) {
      throw new Error('Post not found');
    }

    return updatePost.rows[0]; // Return the first (and only) updated row
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

  static async create(title: string, content: string, userId: number): Promise<Post> {
    const { rows } = await pool.query(
      `INSERT INTO posts (title, content, user_id) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [title, content, userId]
    );
    return rows[0];
  }

  static async findAll(): Promise<Post[]> {
    const { rows } = await pool.query(
      `SELECT p.*, u.username as author_name 
       FROM posts p
       JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC`
    );
    return rows;
  }

  static async findById(id: number): Promise<Post | null> {
    const { rows } = await pool.query(
      `SELECT p.*, u.username as author_name 
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
      [id]
    );
    return rows[0] || null;
  }



  static async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM posts WHERE id = $1', [id]);
  }

  static async findByUserId(userId: number): Promise<Post[]> {
    const { rows } = await pool.query(
      `SELECT p.*, u.username as author_name 
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC`,
      [userId]
    );
    return rows;
  }

  // Admin-specific methods
  static async adminFindAll(): Promise<Post[]> {
    const { rows } = await pool.query(
      `SELECT p.*, u.username as author_name, u.email as author_email
       FROM posts p
       JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC`
    );
    return rows;
  }

  static async adminDelete(postId: number): Promise<void> {
    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
  }

  static async adminUpdate(postId: number, updates: Partial<Post>): Promise<Post> {
    const { rows } = await pool.query(
      `UPDATE posts 
       SET title = COALESCE($1, title),
           content = COALESCE($2, content),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [updates.title, updates.content, postId]
    );
    return rows[0];
  }

  // In PostModel
static async findAllPaginated(page: number = 1, limit: number = 2) {
  const offset = (page - 1) * limit;
  const query = 'SELECT * FROM posts LIMIT $1 OFFSET $2';
  const result = await pool.query(query, [limit, offset]);
  return result.rows;
}

static async count() {
  const result = await pool.query('SELECT COUNT(*) FROM posts');
  return parseInt(result.rows[0].count);
  
}
}

export default PostModel;