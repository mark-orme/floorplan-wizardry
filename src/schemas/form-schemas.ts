
import * as z from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  message: z.string().min(10, 'Message is required'),
  subject: z.string().optional(),
  company: z.string().optional()
});

export const validationDemoSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8)
});

export const propertyFormSchema = z.object({
  order_id: z.string().min(3),
  address: z.string().min(5),
  client_name: z.string().min(2),
  branch_name: z.string().optional()
});
