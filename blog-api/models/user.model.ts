import pool from '../config/db';

interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0] || null;
  }

  static async create(username: string, email: string, passwordHash: string): Promise<User> {
    const { rows } = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [username, email, passwordHash]
    );
    return rows[0];
  }

  static async findById(id: number): Promise<User | null> {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0] || null;
  }

  static async findProfileById(id: number): Promise<Omit<User, 'password_hash'> | null> {
  const { rows } = await pool.query(
    `SELECT id, username, email, created_at FROM users WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}
}

export default UserModel;