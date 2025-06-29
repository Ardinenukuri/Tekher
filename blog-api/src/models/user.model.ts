import pool from '../config/db';

type Role = 'admin' | 'moderator' | 'user';

interface User {
  is_verified: any;
  verification_token: any,
  token_expires: Date | null;
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
  role:Role ; 

}




class UserModel {
  static async delete(userId: number): Promise<boolean> {
    try {
      const result = await pool.query(
        'DELETE FROM users WHERE id = $1', 
        [userId]
      );
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Database deletion error:', error);
      throw error;
    }
  }

  static async findAll(): Promise<Omit<User, 'password_hash'>[]> {
  const { rows } = await pool.query(
    `SELECT id, username, email, role, is_verified, created_at FROM users`
  );
  return rows;
}


  static async update(id: number, updates: Partial<User>): Promise<User> {
  const { rows } = await pool.query(
    `UPDATE users SET
      is_verified = COALESCE($1, is_verified),
      verification_token = COALESCE($2, verification_token),
      token_expires = COALESCE($3, token_expires)
     WHERE id = $4
     RETURNING *`,
    [
      updates.is_verified,
      updates.verification_token,
      updates.token_expires,
      id
    ]
  );
  return rows[0];
}
  
  static async findByEmail(email: string): Promise<User | null> {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0] || null;
  }

  // static async create(username: string, email: string, passwordHash: string, is_verified?: boolean, verification_token?: string, token_expires?: Date): Promise<User> {
  //   const { rows } = await pool.query(
  //     'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
  //     [username, email, passwordHash, is_verified || false, verification_token || null, token_expires || null]
  //   );
  //   return rows[0];
  // }

  // src/models/user.model.ts
static async create(userData: {
  username: string;
  email: string;
  password_hash: string;
  role?: 'admin' | 'moderator' | 'user'; // Make type more specific
  is_verified?: boolean;
  verification_token?: string;
  token_expires?: Date;
}): Promise<User> {
  const defaultRole = 'user'; // Default if not specified
  
  const { rows } = await pool.query(
    `INSERT INTO users (
      username, 
      email, 
      password_hash,
      role,
      is_verified,
      verification_token,
      token_expires
     ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
     RETURNING *`,
    [
      userData.username,
      userData.email,
      userData.password_hash,
      userData.role || defaultRole, // Use provided role or default
      userData.is_verified || false,
      userData.verification_token || null,
      userData.token_expires || null
    ]
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

 
static async setResetToken(email: string, token: string, expires: Date): Promise<void> {
  await pool.query(
    `UPDATE users 
     SET reset_token = $1, 
         reset_token_expires = $2 
     WHERE email = $3`,
    [token, expires, email]
  );
}

static async updatePassword(id: number, hashedPassword: string): Promise<void> {
  await pool.query(
    `UPDATE users 
     SET password_hash = $1 
     WHERE id = $2`,
    [hashedPassword, id]
  );
}

static async findByResetToken(token: string): Promise<User | null> {
  const { rows } = await pool.query(
    `SELECT * FROM users 
     WHERE reset_token = $1 
     AND reset_token_expires > NOW()`,
    [token]
  );
  return rows[0] || null;
}


// In UserModel
static async findAllPaginated(page: number = 1, limit: number = 2) {
  const offset = (page - 1) * limit;
  const query = 'SELECT id, username, email, role, is_verified, created_at  FROM users LIMIT $1 OFFSET $2';
  const result = await pool.query(query, [limit, offset]);
  return result.rows;
}

static async count() {
  const result = await pool.query('SELECT COUNT(*) FROM users');
  return parseInt(result.rows[0].count);
}

static async findByVerificationToken(token: string): Promise<User | null> {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE verification_token = $1',
      [token]
    );
    return rows[0] || null;
  }


}





export default UserModel;