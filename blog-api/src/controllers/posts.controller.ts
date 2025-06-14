import { Request, Response, NextFunction } from 'express';
import { createPostSchema, updatePostSchema } from '../schemas/posts.schema';
import PostModel from '../models/post.model';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';
import { ApiResponse } from '../types/common.types';
import CommentModel from '../models/comment.model';
import LikeModel from '../models/like.model';
import jwt from 'jsonwebtoken';

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

export const getPostById = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    const postId = parseInt(req.params.id);
    const post = await PostModel.findById(postId);

    if (!post) throw new NotFoundError('Post not found');

    res.status(200).json({
      success: true,
      message: 'Post retrieved successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

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
