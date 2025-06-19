import { NextFunction, Request, Response } from 'express';
import pool from '../config/db'; 
import { ApiResponse } from '../types/common.types'; 

const VALID_STATUSES = ['published', 'draft'];

export const updatePostDetails = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => { 
  try {
    const postId = parseInt(req.params.postId, 10);
    if (isNaN(postId)) {
      res.status(400).json({ success: false, message: 'Invalid post ID provided.' });
      return; 
    }

    const { status, categoryId } = req.body;

    if (status === undefined && categoryId === undefined) {
      res.status(400).json({
        success: false,
        message: 'No valid fields to update were provided. Please provide a status or categoryId.',
      });
      return;
    }

    const updateFields: string[] = [];
    const queryParams: (string | number)[] = [];
    let paramIndex = 1;

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
        });
        return;
      }
      updateFields.push(`status = $${paramIndex++}`);
      queryParams.push(status);
    }

    if (categoryId !== undefined) {
      const numericCategoryId = parseInt(categoryId, 10);
      if (isNaN(numericCategoryId)) {
        res.status(400).json({ success: false, message: 'Category ID must be a number.' });
        return;
      }
      updateFields.push(`category_id = $${paramIndex++}`);
      queryParams.push(numericCategoryId);
    }

    queryParams.push(postId);

    const updateQuery = `
      UPDATE posts 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramIndex}
      RETURNING id, title, status, category_id;
    `;
    
    const result = await pool.query(updateQuery, queryParams);

    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Post not found or no changes were made.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Post updated successfully.',
      data: result.rows[0],
    });

  } catch (err) {
    next(err);
  }
};