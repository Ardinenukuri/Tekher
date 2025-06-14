import db from '../config/db';
import pool from '../config/db';

interface Like {
  id: number;
  post_id: number;
  user_id: number;
  created_at: Date;
}

class LikeModel {
  static async toggle({ postId, userId }: { postId: number; userId: number; }): Promise<Like | null> {
    // 1. Check if the like already exists using your other method
    const alreadyLiked = await this.isLiked(postId, userId);

    if (alreadyLiked) {
      // 2. If it exists, delete it and return null to indicate it was removed
      await this.delete(postId, userId);
      return null;
    } else {
      // 3. If it does not exist, create it and return the new like object
      const newLike = await this.create(postId, userId);
      return newLike;
    }
  }
  
  static async create(postId: number, userId: number): Promise<Like> {
    const { rows } = await pool.query(
      `INSERT INTO likes (post_id, user_id)
       VALUES ($1, $2)
       RETURNING *`,
      [postId, userId]
    );
    return rows[0];
  }

  static async delete(postId: number, userId: number): Promise<void> {
    await pool.query(
      `DELETE FROM likes WHERE post_id = $1 AND user_id = $2`,
      [postId, userId]
    );
  }

  static async isLiked(postId: number, userId: number): Promise<boolean> {
    const result = await pool.query(
      `SELECT * FROM likes WHERE post_id = $1 AND user_id = $2`,
      [postId, userId]
    );
    return result.rowCount! > 0;
  }

  static async countLikes(postId: number): Promise<number> {
    const result = await pool.query(
      `SELECT COUNT(*) FROM likes WHERE post_id = $1`,
      [postId]
    );
    return parseInt(result.rows[0].count, 10);
  }

  static async getLikesByUser(userId: number): Promise<Like[]> {
    const { rows } = await pool.query(
      `SELECT * FROM likes WHERE user_id = $1`,
      [userId]
    );
    return rows;
  }

  static async getLikesByPost(postId: number): Promise<Like[]> {
    const { rows } = await pool.query(
      `SELECT * FROM likes WHERE post_id = $1`,
      [postId]
    );
    return rows;
  }

  static async findAll(): Promise<Like[]> {
    const { rows } = await pool.query(
        'SELECT * FROM likes'
    )
    return rows;
}
}

export default LikeModel;
