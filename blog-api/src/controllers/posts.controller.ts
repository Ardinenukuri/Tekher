import { Request, Response, NextFunction } from 'express';
import { createPostSchema, updatePostSchema } from '../schemas/posts.schema';
import PostModel from '../models/post.model';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';
import { ApiResponse } from '../types/common.types';

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    userId: number;
    role: string;
  };
}

export const createPost = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = createPostSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors: Record<string, string[]> = {};
      parsed.error.errors.forEach((err) => {
        const key = err.path.join('.');
        if (!errors[key]) errors[key] = [];
        errors[key].push(err.message);
      });

      res.status(400).json({
        success: false,
        message: 'creation failed',
        errors,
      });
      return;
    }

    const { title, content } = parsed.data;
    const userId = (req as any).user.userId;

    const post = await PostModel.create(title, content, userId);
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};


export const getAllPosts = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    const posts = await PostModel.findAll();
    res.status(200).json({
      success: true,
      message: 'Posts fetched successfully',
      data: posts,
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

export const updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const postId = parseInt(req.params.id);
    const userId = (req as any).user?.userId;

    // Validate the request body with Zod schema
    const parseResult = updatePostSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errors: Record<string, string[]> = {};
      parseResult.error.errors.forEach(err => {
        const field = err.path[0] as string;
        if (!errors[field]) errors[field] = [];
        errors[field].push(err.message);
      });
      const response: ApiResponse = {
        success: false,
        message: 'Validation errors',
        errors,
      };
      res.status(400).json(response);
      return;
    }
    const { title, content } = parseResult.data;

    // Check post exists and user is authorized
    const post = await PostModel.findById(postId);
    if (!post) throw new NotFoundError('Post not found');
    if (post.user_id !== userId) throw new ForbiddenError('Not authorized');

    // MAIN FIX: Added await here
    const updatedPost = await PostModel.update(postId, title, content);
    
    const response: ApiResponse = {
      success: true,
      message: 'Post updated successfully',
      data: updatedPost,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = (req as any).user?.userId;

    const post = await PostModel.findById(postId);
    if (!post) throw new NotFoundError('Post not found');
    if (post.user_id !== userId) throw new ForbiddenError('Not authorized');

    await PostModel.delete(postId);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
