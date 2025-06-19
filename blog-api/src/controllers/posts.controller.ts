import { Request, Response, NextFunction } from 'express';
import { createPostSchema, updatePostSchema } from '../schemas/posts.schema';
import PostModel from '../models/post.model';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';
import { ApiResponse } from '../types/common.types';
import CommentModel from '../models/comment.model';
import LikeModel from '../models/like.model';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import { getUserIdFromToken } from '../utils/auth';

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    userId: number;
    role: string;
  };
}

// export const createPost = async (
//   req: Request,
//   res: Response<ApiResponse>,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const parsed = createPostSchema.safeParse(req.body);
//     if (!parsed.success) {
//       const errors: Record<string, string[]> = {};
//       parsed.error.errors.forEach((err) => {
//         const key = err.path.join('.');
//         if (!errors[key]) errors[key] = [];
//         errors[key].push(err.message);
//       });

//       res.status(400).json({
//         success: false,
//         message: 'creation failed',
//         errors,
//       });
//       return;
//     }

//     const { title, content } = parsed.data;
//     const userId = (req as any).user.userId;

//     const post = await PostModel.create(title, content, userId);
//     res.status(201).json({
//       success: true,
//       message: 'Post created successfully',
//       data: post,
//     });
//   } catch (error) {
//     next(error);
//   }
// };


export const getAllPosts = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 2;
    
    const posts = await PostModel.findAllPaginated(page, limit);
    const totalPosts = await PostModel.count();
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({
      success: true,
      message: 'Posts fetched successfully',
      data: posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalPosts,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

// In your src/controllers/posts.controller.ts (or wherever getPostById is)

// export const getPostById = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params; 
//     console.log(`[BACKEND CONTROLLER] Received request for post with param: ${id} (Type: ${typeof id})`);

//     // --- THIS IS THE CRUCIAL FIX ---
//     // Convert the 'id' parameter from a string to an integer.
//     const postId = parseInt(id, 10);

//     // Add a check to ensure the result is a valid number.
//     // This prevents errors if someone navigates to /api/posts/abc
//     if (isNaN(postId)) {
//       res.status(400).json({ message: 'Invalid post ID format. Must be a number.' });
//       return;
//     }
//     // ------------------------------------

//     console.log(`[BACKEND CONTROLLER] Parsed ID to number: ${postId}. Calling model...`);

//     // Now, pass the numeric `postId` to your model function.
//     const post = await PostModel.findById(postId); 

//     if (!post) {
//       console.log(`[BACKEND CONTROLLER] Post with ID ${postId} not found by model.`);
//       res.status(404).json({ message: 'Post not found' });
//       return;
//     }

//     res.json(post);

//   } catch (error) {
//     console.error(`Error in getPostById for param ${req.params.id}:`, error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const postId = parseInt(req.params.id);
//     const userId = (req as any).user?.userId;

//     // Validate the request body with Zod schema
//     const parseResult = updatePostSchema.safeParse(req.body);
//     if (!parseResult.success) {
//       const errors: Record<string, string[]> = {};
//       parseResult.error.errors.forEach(err => {
//         const field = err.path[0] as string;
//         if (!errors[field]) errors[field] = [];
//         errors[field].push(err.message);
//       });
//       const response: ApiResponse = {
//         success: false,
//         message: 'Validation errors',
//         errors,
//       };
//       res.status(400).json(response);
//       return;
//     }
//     const { title, content } = parseResult.data;

//     // Check post exists and user is authorized
//     const post = await PostModel.findById(postId);
//     if (!post) throw new NotFoundError('Post not found');
//     if (post.user_id !== userId) throw new ForbiddenError('Not authorized');

//     // MAIN FIX: Added await here
//     const updatedPost = await PostModel.update(postId, title, content);
    
//     const response: ApiResponse = {
//       success: true,
//       message: 'Post updated successfully',
//       data: updatedPost,
//     };
//     res.json(response);
//   } catch (error) {
//     next(error);
//   }
// };



// export const deletePost = async (
//   req: Request,
//   res: Response<ApiResponse>,
//   next: NextFunction
// ) => {
//   try {
//     const postId = parseInt(req.params.id);
//     const userId = (req as any).user?.userId;

//     const post = await PostModel.findById(postId);
//     if (!post) throw new NotFoundError('Post not found');
//     if (post.user_id !== userId) throw new ForbiddenError('Not authorized');

//     await PostModel.delete(postId);

//     res.status(200).json({
//       success: true,
//       message: 'Post deleted successfully',
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const commentOnPost = async (
  req: Request,
  res: Response<ApiResponse>) => {
  const { postId } = req.params;
  const { text } = req.body;
  const comment = await CommentModel.create(text, authReq(req).userId, +postId);
  res.status(201).json({ success: true, data: comment });
};

// 2b. Get comments for a post
export const getComments = async (
  req: Request,
  res: Response<ApiResponse>
) => {
  const comments = await CommentModel.findByPostId(parseInt(req.params.postId));
  res.json({ success: true, data: comments });
};

// 2c. Delete own comment
export const deleteOwnComment = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const commentId = parseInt(req.params.commentId);
  const userId = authReq(req).userId;

  const comment = await CommentModel.findById(commentId);

  if (!comment) {
    return res.status(404).json({ success: false, message: 'Comment not found' });
  }

  if (comment.user_id !== userId) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  await CommentModel.delete(commentId);
  res.json({ success: true, message: 'Comment deleted' });
};

// 2d. Like & unlike post
export const likePost = async (req: Request,
  res: Response<ApiResponse>) => {
  const { postId } = req.params;
  const like = await LikeModel.toggle({ postId: +postId, userId: authReq(req).userId });
  res.json({ success: true, data: like });
};

export const authReq = (req: Request): { userId: number } => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new Error('No authorization header');
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

  return { userId: decoded.userId };
};

export const getCommentsForPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;

    // --- THIS IS THE UPDATED SQL QUERY ---
    // It joins with the users table to get the `username` for each comment.
    const query = `
      SELECT 
        c.id, 
        c.text, 
        c.created_at, 
        c.user_id, 
        u.username AS author,  -- We select the username and alias it as "author"
        u.role                 -- You can also select the role or other user info
      FROM 
        comments c
      JOIN 
        users u ON c.user_id = u.id
      WHERE 
        c.post_id = $1
      ORDER BY 
        c.created_at DESC
    `;

    const result = await pool.query(query, [postId]);
    
    // The backend now returns an array of comments, each with an `author` field.
    res.status(200).json(result.rows);

  } catch (err) {
    next(err);
  }
};


export const getPostById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const postId = parseInt(req.params.id, 10);
    if (isNaN(postId)) {
      res.status(400).json({ success: false, message: 'Invalid post ID format. Must be a number.' });
      return;
    }

    const currentUserId = getUserIdFromToken(req);

    const post = await PostModel.findById(postId);
    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    const [commentsResult, likesResult, userLikeResult] = await Promise.all([
      pool.query(
        `SELECT c.*, u.username AS author 
         FROM comments c
         JOIN users u ON c.user_id = u.id
         WHERE c.post_id = $1 
         ORDER BY c.created_at DESC`,
        [postId]
      ),
      pool.query(
        `SELECT COUNT(*) FROM likes WHERE post_id = $1`,
        [postId]
      ),
      currentUserId
        ? pool.query(
            `SELECT 1 FROM likes WHERE post_id = $1 AND user_id = $2`,
            [postId, currentUserId]
          )
        : Promise.resolve({ rowCount: 0 }),
    ]);

    const fullPostData = {
      ...post,
      comments: commentsResult.rows,
      likes: parseInt(likesResult.rows[0].count, 10),
      // FIX #2: Safely access rowCount
      userHasLiked: (userLikeResult?.rowCount ?? 0) > 0,
    };

    res.status(200).json({ success: true, data: fullPostData });

  } catch (err) {
    next(err);
  }
};