import { z } from 'zod';

// regex for password validation
const uppercaseRegex = /[A-Z]/;
const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

// Signup schema - creates USER role
export const signupSchema = z.object({
  name: z.string()
    .min(20, 'Name must be at least 20 characters')
    .max(60, 'Name must not exceed 60 characters'),
  email: z.string()
    .email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .regex(uppercaseRegex, 'Password must contain at least one uppercase letter')
    .regex(specialCharRegex, 'Password must contain at least one special character'),
  address: z.string()
    .max(400, 'Address must not exceed 400 characters')
    .optional()
});

// Login
export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email format'),
  password: z.string()
    .min(1, 'Password is required')
});

// Admin can create user with any role
export const createUserSchema = z.object({
  name: z.string()
    .min(20, 'Name must be at least 20 characters')
    .max(60, 'Name must not exceed 60 characters'),
  email: z.string()
    .email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .regex(uppercaseRegex, 'Password must contain at least one uppercase letter')
    .regex(specialCharRegex, 'Password must contain at least one special character'),
  address: z.string()
    .max(400, 'Address must not exceed 400 characters')
    .optional(),
  role: z.enum(['ADMIN', 'USER', 'OWNER'], {
    errorMap: () => ({ message: 'Role must be ADMIN, USER, or OWNER' })
  })
});

// Store creation
export const createStoreSchema = z.object({
  name: z.string()
    .min(20, 'Store name must be at least 20 characters')
    .max(60, 'Store name must not exceed 60 characters'),
  email: z.string()
    .email('Invalid email format'),
  address: z.string()
    .max(400, 'Address must not exceed 400 characters'),
  ownerUserId: z.string()
    .uuid('Invalid owner user ID format')
});

// Rating submission
export const ratingSchema = z.object({
  storeId: z.string()
    .min(1, 'Store ID is required'),
  rating: z.union([z.number(), z.string()])
    .transform(val => typeof val === 'string' ? parseInt(val, 10) : val)
    .pipe(z.number()
      .int('Rating must be an integer')
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must not exceed 5'))
});

// Change password
export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'New password must be at least 8 characters')
    .max(16, 'New password must not exceed 16 characters')
    .regex(uppercaseRegex, 'New password must contain at least one uppercase letter')
    .regex(specialCharRegex, 'New password must contain at least one special character')
});

// Query params for pagination/filtering
export const paginationSchema = z.object({
  page: z.string()
    .optional()
    .transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string()
    .optional()
    .transform(val => val ? parseInt(val, 10) : 10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  search: z.string().optional(),
  role: z.enum(['ADMIN', 'USER', 'OWNER']).optional()
});

// Validate helper function
export const validate = (schema, data) => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = {};
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach(err => {
          const path = err.path.join('.');
          formattedErrors[path] = err.message;
        });
      }
      return { success: false, errors: formattedErrors };
    }
    // non-Zod errors
    console.error('Validation error:', error);
    return { success: false, errors: { general: error.message || 'Validation failed' } };
  }
};
