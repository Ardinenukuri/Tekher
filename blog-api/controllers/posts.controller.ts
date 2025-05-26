import { Request, Response, NextFunction } from 'express';
import PostModel from '../models/post.model';

export const createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, content } = req.body;
    const userId = (req as any).user.userId;
    
    const post = await PostModel.create(title, content, userId);
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const posts = await PostModel.findAll();
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const post = await PostModel.findById(parseInt(req.params.id));
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, content } = req.body;
    const userId = (req as any).user.userId;
    const postId = parseInt(req.params.id);
    
    const post = await PostModel.findById(postId);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    if (post.user_id !== userId) {
      res.status(403).json({ message: 'Not authorized to update this post' });
      return;
    }
    
    const updatedPost = await PostModel.update(postId, title, content);
    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const postId = parseInt(req.params.id);
    
    const post = await PostModel.findById(postId);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    if (post.user_id !== userId) {
      res.status(403).json({ message: 'Not authorized to delete this post' });
      return;
    }
    
    await PostModel.delete(postId);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};