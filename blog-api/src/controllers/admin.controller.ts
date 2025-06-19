import { NextFunction, Request, Response } from 'express';
import UserModel from '../models/user.model';
import PostModel from '../models/post.model';
import { ApiResponse } from '../types/common.types';
import { createPostSchema, updatePostSchema } from '../schemas/posts.schema';
import CommentModel from '../models/comment.model';
import LikeModel from '../models/like.model';
import { processImage } from '../utils/imageUploader';
import slugify from 'slugify';
import UpdatePostData  from '../models/post.model'; 
import pool from '../config/db';




export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 2;
    
    const users = await UserModel.findAllPaginated(page, limit);
    const totalUsers = await UserModel.count();
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalUsers,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ 
        success: false,
        message: 'Failed to fetch users',
        error: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: 'Failed to fetch users',
        error: 'An unknown error occurred' 
      });
    }
  }
};

// export const getAllPosts = async (
//   req: Request,
//   res: Response<ApiResponse>,
//   next: NextFunction
// ) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 2;
    
//     const posts = await PostModel.findAllPaginated(page, limit);
//     const totalPosts = await PostModel.count();
//     const totalPages = Math.ceil(totalPosts / limit);

//     res.status(200).json({
//       success: true,
//       message: 'Posts fetched successfully',
//       data: posts,
//       pagination: {
//         currentPage: page,
//         totalPages,
//         totalItems: totalPosts,
//         itemsPerPage: limit,
//         hasNextPage: page < totalPages,
//         hasPreviousPage: page > 1
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;


    const { search, status, categoryId, authorId, startDate, endDate } = req.query;


    const whereClauses: string[] = [];
    const queryParams: (string | number)[] = [];
    let paramIndex = 1; 

    if (search) {
      whereClauses.push(`p.title ILIKE $${paramIndex++}`);
      queryParams.push(`%${search}%`);
    }
    if (status && status !== 'all') {
      whereClauses.push(`p.status = $${paramIndex++}`);
      queryParams.push(status as string);
    }
    if (categoryId && categoryId !== 'all') {
      whereClauses.push(`p.category_id = $${paramIndex++}`);
      queryParams.push(parseInt(categoryId as string, 10));
    }
    if (authorId && authorId !== 'all') {
      whereClauses.push(`p.user_id = $${paramIndex++}`);
      queryParams.push(parseInt(authorId as string, 10));
    }
    if (startDate) {
        whereClauses.push(`p.created_at >= $${paramIndex++}`);
        queryParams.push(startDate as string);
    }
    if (endDate) {
        const inclusiveEndDate = new Date(endDate as string);
        inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1);
        whereClauses.push(`p.created_at < $${paramIndex++}`);
        queryParams.push(inclusiveEndDate.toISOString().split('T')[0]);
    }

    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const postsQuery = `
      SELECT 
        p.id, p.title, p.slug, p.status, p.created_at, 
        u.username AS author_name, 
        c.name AS category_name
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereString}
      ORDER BY p.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    
    const totalResultQuery = `SELECT COUNT(*) FROM posts p ${whereString}`;

    const postsResult = await pool.query(postsQuery, [...queryParams, limit, offset]);
    const totalResult = await pool.query(totalResultQuery, queryParams);
    
    const totalItems = parseInt(totalResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      success: true,
      data: postsResult.rows,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    if (req.user?.userId === parseInt(userId)) {
      res.status(400).json({ message: 'Admins cannot delete themselves' });
      return;
    }

    await UserModel.delete(parseInt(userId));
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};



export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    
    await PostModel.delete(parseInt(postId));
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post' });
  }
};


export const deleteComment = async (req: Request, res: Response<ApiResponse>) => {
  try {
    await CommentModel.delete(parseInt(req.params.commentId));
    res.json({ success: true, message: 'Comment deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete comment' });
  }
};

export const getAllLikes = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const likes = await LikeModel.findAll(); 
    res.json({ success: true, data: likes });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch likes' });
  }
};


export const updateUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params;
    const { newRole } = req.body;
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication error, user not found on request.' });
      return;
    }
    const requestingUserId = req.user.userId;

    const idToUpdate = parseInt(userId, 10);
    if (isNaN(idToUpdate)) {
      res.status(400).json({ success: false, message: 'Invalid user ID provided.' });
      return;
    }

    if (idToUpdate === requestingUserId) {
      res.status(400).json({ success: false, message: "Cannot change your own role." });
      return; 
    }

    if (!['admin', 'user'].includes(newRole)) {
      res.status(400).json({ success: false, message: "Invalid role specified. Can only set to 'admin' or 'user'." });
      return; 
    }

    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, email, role',
      [newRole, idToUpdate]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: "User not found." });
      return; 
    }
    res.status(200).json({ success: true, message: 'User role updated.', data: result.rows[0] });

  } catch (err) {
    next(err);
  }
};


export const getAllPostsforadmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const loggedInUserId = req.user?.userId;

    if (!loggedInUserId) {
        res.status(401).json({ success: false, message: 'Unauthorized. User not found on request.' });
        return; 
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const { search, status, categoryId, startDate, endDate } = req.query;

    const whereClauses: string[] = [];
    const queryParams: (string | number)[] = [];
    let paramIndex = 1;
    whereClauses.push(`p.user_id = $${paramIndex++}`);
    queryParams.push(loggedInUserId);

    if (search) {
      whereClauses.push(`p.title ILIKE $${paramIndex++}`);
      queryParams.push(`%${search}%`);
    }
    if (status && status !== 'all') {
      whereClauses.push(`p.status = $${paramIndex++}`);
      queryParams.push(status as string);
    }
    if (categoryId && categoryId !== 'all') {
      whereClauses.push(`p.category_id = $${paramIndex++}`);
      queryParams.push(parseInt(categoryId as string, 10));
    }
    if (startDate) {
        whereClauses.push(`p.created_at >= $${paramIndex++}`);
        queryParams.push(startDate as string);
    }
    if (endDate) {
        const inclusiveEndDate = new Date(endDate as string);
        inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1);
        whereClauses.push(`p.created_at < $${paramIndex++}`);
        queryParams.push(inclusiveEndDate.toISOString().split('T')[0]);
    }

    const whereString = `WHERE ${whereClauses.join(' AND ')}`;

    const postsQuery = `
      SELECT 
        p.id, p.title, p.slug, p.status, p.created_at, 
        p.category_id,
        u.username AS author_name, 
        c.name AS category_name
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereString}
      ORDER BY p.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    
    const totalResultQuery = `SELECT COUNT(*) FROM posts p ${whereString}`;

    const postsResult = await pool.query(postsQuery, [...queryParams, limit, offset]);
    const totalResult = await pool.query(totalResultQuery, queryParams);
    
    const totalItems = parseInt(totalResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      success: true,
      data: postsResult.rows,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let uploadedFile: Express.Multer.File | undefined;
    try {
      uploadedFile = await processImage(req);
    } catch (fileError: any) {
      console.error('File processing error:', fileError.message);
      res.status(400).json({ success: false, message: fileError.message });
      return;
    }


    console.log('Request Body (Text Fields):', req.body);
    console.log('Request File (Image Data):', uploadedFile);

    const parsed = createPostSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, errors: parsed.error.errors });
      return;
    }
    const { title, content, status, categoryId } = parsed.data;

    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const imageFilename = uploadedFile ? uploadedFile.filename : null;
    const postData = {
      title,
      content,
      slug: slugify(title, { lower: true, strict: true }),
      userId,
      status,
      categoryId: parseInt(categoryId, 10),
      image: imageFilename,
    };
    
    const newPost = await PostModel.create(postData);
    res.status(201).json({ success: true, message: 'Post created successfully', data: newPost });

  } catch (err) {
    next(err);
  }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log(`--- [UPDATE POST] API route hit for post ID: ${req.params.id} ---`);
  try {
    let uploadedFile: Express.Multer.File | undefined;
    try {
      uploadedFile = await processImage(req);
    } catch (fileError: any) {
      res.status(400).json({ success: false, message: fileError.message });
      return;
    }
    
    const postId = parseInt(req.params.id, 10);
    if (isNaN(postId)) {
        res.status(400).json({ success: false, message: 'Invalid Post ID.' });
        return;
    }
    const existingPost = await PostModel.findById(postId);
    if (!existingPost) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }
    if (existingPost.user_id !== req.user?.userId) {
       res.status(403).json({ success: false, message: 'Forbidden: You can only edit your own posts.' });
       return;
    }


    const parsed = updatePostSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, errors: parsed.error.errors });
      return;
    }

  
    const updates: UpdatePostData = { ...parsed.data };
    
    if (uploadedFile) {
      updates.image = uploadedFile.filename;
    }
    
    const updatedPost = await PostModel.update(postId, updates);
    if (!updatedPost) {
      res.status(404).json({ success: false, message: "Update failed in the database." });
      return;
    }

    res.status(200).json({ success: true, message: 'Post updated successfully', data: updatedPost });

  } catch (err) {
    console.error(`--- [UPDATE POST] Error:`, err);
    next(err);
  }
};