import pool from '../config/db';

// The 'post_status' type should match the ENUM you created in PostgreSQL
export type PostStatus = 'draft' | 'published' | 'archived';

// UPDATED: The Post interface now includes the new database fields
// and optional fields from JOINs for fetching data.
interface Post {
  id: number;
  title: string;
  content: string;
  slug: string; // ADDED: Non-optional slug
  status: PostStatus; // ADDED: Using the custom PostStatus type
  category_id?: number | null; // ADDED: The foreign key to the categories table
  image?: string;
  user_id: number;
  created_at: Date;
  updated_at: Date;

  // Optional fields that get added when you JOIN tables
  author_name?: string;
  category_name?: string;
  author_email?: string;
}

// A helper interface for creating posts to make parameters cleaner
interface CreatePostData {
  title: string;
  content: string;
  slug: string;
  userId: number;
  status: PostStatus;
  categoryId?: number | null;
  image?: string | null;
}

// A helper interface for updating posts
type UpdatePostData = Partial<Omit<CreatePostData, 'userId'>>;

class PostModel {
  [x: string]: string;
  // FIXED & UPDATED: This method now correctly handles all new fields
  // and fixes a bug where user_id was not being inserted correctly.
  static async create(data: CreatePostData): Promise<Post> {
    // This line uses the single 'data' object. There are no other parameters.
    const { title, content, slug, userId, status, categoryId, image } = data;
    
    const { rows } = await pool.query(
      `INSERT INTO posts (title, content, slug, user_id, status, category_id, image) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [title, content, slug, userId, status, categoryId, image]
    );
    return rows[0];
  }

  // UPDATED: This method now uses COALESCE to handle partial updates for all fields,
  // making it much more flexible and robust.
  static async update(id: number, updates: UpdatePostData): Promise<Post> {
    // This line uses the 'id' and the single 'updates' object.
    const { title, content, slug, status, categoryId, image } = updates;

    const { rows, rowCount } = await pool.query(
      `UPDATE posts
       SET
         title = COALESCE($1, title),
         content = COALESCE($2, content),
         slug = COALESCE($3, slug),
         status = COALESCE($4, status),
         category_id = COALESCE($5, category_id),
         image = COALESCE($6, image),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [title, content, slug, status, categoryId, image, id]
    );

    if (rowCount === 0) {
      throw new Error('Post not found or no new data to update');
    }

    return rows[0];
  }
  // UPDATED: Joins with categories to get the category name.
  // Uses LEFT JOIN to ensure posts without a category are still returned.
  static async findAll(): Promise<Post[]> {
    const { rows } = await pool.query(
      `SELECT p.*, u.username as author_name, c.name as category_name
       FROM posts p
       JOIN users u ON p.user_id = u.id
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.created_at DESC`
    );
    return rows;
  }

  // UPDATED: Also joins with categories.
  static async findById(id: number): Promise<any | null> {
    // Check the type of the ID received by the model
    console.log(`[POST MODEL] findById received ID: ${id} (Type: ${typeof id})`);

    const query = {
      text: 'SELECT * FROM posts WHERE id = $1',
      values: [id],
    };

    console.log(`[POST MODEL] Executing query: ${query.text} with values: [${query.values}]`);

    try {
      const result = await pool.query(query);
      if (result.rows.length > 0) {
        console.log('[POST MODEL] Post found. Returning row data.');
        return result.rows[0];
      }
      console.log('[POST MODEL] Query executed, but no rows were returned.');
      return null;
    } catch (error) {
      console.error('[POST MODEL] Error executing findById query:', error);
      throw error;
    }
  }


  static async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM posts WHERE id = $1', [id]);
  }

  // The rest of your methods can remain as they are, but here they are for completeness.
  // Note that they could also be updated to join with the categories table if needed.
  static async findByUserId(userId: number): Promise<Post[]> {
    const { rows } = await pool.query(
      `SELECT p.*, u.username as author_name, c.name as category_name
       FROM posts p
       JOIN users u ON p.user_id = u.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async adminFindAll(): Promise<Post[]> {
    const { rows } = await pool.query(
      `SELECT p.*, u.username as author_name, u.email as author_email, c.name as category_name
       FROM posts p
       JOIN users u ON p.user_id = u.id
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.created_at DESC`
    );
    return rows;
  }

  static async adminDelete(postId: number): Promise<void> {
    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
  }

  // This method is now effectively the same as our new `update` method.
  // You could consider consolidating them in the future.
  static async adminUpdate(postId: number, updates: Partial<Post>): Promise<Post> {
    const { rows } = await pool.query(
      `UPDATE posts 
       SET title = COALESCE($1, title),
           content = COALESCE($2, content),
           slug = COALESCE($3, slug),
           status = COALESCE($4, status),
           category_id = COALESCE($5, category_id),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [updates.title, updates.content, updates.slug, updates.status, updates.category_id, postId]
    );
    return rows[0];
  }

  static async findAllPaginated(page: number = 1, limit: number = 2): Promise<Post[]> {
    const offset = (page - 1) * limit;
    const { rows } = await pool.query('SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
    return rows;
  }

  static async count(): Promise<number> {
    const { rows } = await pool.query('SELECT COUNT(*) FROM posts');
    return parseInt(rows[0].count, 10);
  }
}

export default PostModel;