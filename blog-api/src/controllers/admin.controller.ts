// admin.controller.ts
import { NextFunction, Request, Response } from 'express';
import UserModel from '../models/user.model';
import PostModel from '../models/post.model';
import { ApiResponse } from '../types/common.types';


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