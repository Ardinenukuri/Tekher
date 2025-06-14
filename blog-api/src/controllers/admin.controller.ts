// admin.controller.ts
import { NextFunction, Request, Response } from 'express';
import UserModel from '../models/user.model';
import PostModel from '../models/post.model';
import { ApiResponse } from '../types/common.types';
import { createPostSchema, updatePostSchema } from '../schemas/posts.schema';
import CommentModel from '../models/comment.model';
import LikeModel from '../models/like.model';
import { uploadImage } from '../utils/imageUploader';



// const authReq = (req: Request): { userId: number } => req.user;


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

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    // Prevent admin from deleting themselves
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

export const createPost = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const parsed = createPostSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.errors as any, // should be cast/mapped properly in production
      });
    }

    const { title, content } = parsed.data;
    const image = req.file ? await uploadImage(req.file) : undefined


    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const post = await PostModel.create(title, content, userId, image);

    res.status(201).json({ success: true, message: 'Post created', data: post });
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const postId = parseInt(req.params.id);
    const parsed = updatePostSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.errors as any,
      });
    }

    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const image = req.file ? await uploadImage(req.file) : post.image; 

    const updated = await PostModel.update(postId, parsed.data.title, parsed.data.content, image);

    res.json({ success: true, message: 'Post updated', data: updated });
  } catch (err) {
    next(err);
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
