
import { z } from 'zod';

export const propertyFormSchema = z.object({
  orderId: z.string().min(3, { message: "Order ID is required" }),
  address: z.string().min(5, { message: "Address is required" }),
  clientName: z.string().min(2, { message: "Client name is required" }),
  price: z.string().min(1, { message: "Price is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  isActive: z.boolean()
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
