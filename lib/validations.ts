import { z } from 'zod';

export const bookingSchema = z.object({
  domain: z.enum(['AI', 'FULL_STACK', 'CLOUD']),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Phone number too short').max(20, 'Phone number too long').optional().or(z.literal('')),
  company: z.string().max(200, 'Company name too long').optional().or(z.literal('')),
  projectTitle: z.string().min(3, 'Project title must be at least 3 characters').max(200, 'Title too long').optional().or(z.literal('')),
  projectDescription: z.string().min(20, 'Please describe your project (at least 20 characters)').max(5000, 'Description too long'),
  budget: z.string().max(100, 'Budget too long').optional().or(z.literal('')),
  timeline: z.string().max(100, 'Timeline too long').optional().or(z.literal('')),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const adminLoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export const updateStatusSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'IN_DISCUSSION', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
});
