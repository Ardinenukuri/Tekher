import { z } from 'zod';


export const createPostSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .regex(/^[A-Za-z0-9\s.,!?'"-]+$/, 'Title contains invalid characters'),
  
  content: z
    .string()
    .min(20, 'Content must be at least 20 characters long')
    .max(5000, 'Content cannot exceed 5000 characters')
    .refine((val) => !/(<script|<\/script>)/i.test(val), {
      message: 'Content contains forbidden HTML tags',
    }),
});

export const updatePostSchema = z.object({
  title: z.string().min(5, 'Title must have 5 characters'),
  content: z.string().min(20, 'Content must have 20 characters'),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
