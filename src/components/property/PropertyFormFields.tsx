import * as z from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const PropertyFormSchema = z.object({
  order_id: z.string().min(1, { message: 'Order ID is required' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters' }),
  client_name: z.string().min(2, { message: 'Client name is required' }),
  branch_name: z.string().optional()
});

export type PropertyFormValues = z.infer<typeof PropertyFormSchema>;

interface PropertyFormFieldsProps {
  form: UseFormReturnType;
}

interface UseFormReturnType {
  control: any;
  [key: string]: any;
}

export const PropertyFormFields = ({ form }: PropertyFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="order_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Order ID</FormLabel>
            <FormControl>
              <Input placeholder="e.g. ORD-12345" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Address</FormLabel>
            <FormControl>
              <Input placeholder="e.g. 123 Main St, City" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="client_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Client Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g. John Smith" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="branch_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Branch Name (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Downtown Office" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
