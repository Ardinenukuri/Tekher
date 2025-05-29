// admin.controller.ts
import { Request, Response } from 'express';
import UserModel from '../models/user.model';
import PostModel from '../models/post.model'; // Assuming you have a PostModel

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserModel.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Assuming you have a PostModel with findAll method
    const posts = await PostModel.findAll();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts' });
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