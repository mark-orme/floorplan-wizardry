
import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  subject: z.string().min(3, { message: 'Subject must be at least 3 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' })
});

export const propertyFormSchema = z.object({
  orderId: z.string().min(3, { message: "Order ID is required" }),
  address: z.string().min(5, { message: "Address is required" }),
  clientName: z.string().min(2, { message: "Client name is required" }),
  price: z.string().min(1, { message: "Price is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  isActive: z.boolean()
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
