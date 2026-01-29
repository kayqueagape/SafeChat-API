import { z } from 'zod';

/**
 * Validation schemas using Zod
 */

export const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string()
    .email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const faceLoginSchema = z.object({
  imageBase64: z.string().min(1, 'Image is required'),
  userId: z.string().min(1, 'Valid user ID is required')
});

export const faceRegisterSchema = z.object({
  imageBase64: z.string().min(1, 'Image is required')
});

export const createRoomSchema = z.object({
  name: z.string()
    .min(1, 'Room name is required')
    .max(100, 'Room name must be at most 100 characters'),
  description: z.string().max(500, 'Description must be at most 500 characters').optional(),
  isPrivate: z.boolean().default(true)
});

export const sendMessageSchema = z.object({
  content: z.string()
    .min(1, 'Message content is required')
    .max(1000, 'Message must be at most 1000 characters'),
  roomId: z.string().min(1, 'Valid room ID is required')
});

/**
 * Validation middleware factory
 */
export function validate(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors
        });
      }
      next(error);
    }
  };
}
