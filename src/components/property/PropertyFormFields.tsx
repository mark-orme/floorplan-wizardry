
import React, { useContext } from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { FormFieldType } from "@/types/forms";
import { z } from 'zod';

// Define the schema for property form validation
export const propertyFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters' }),
  postcode: z.string().min(5, { message: 'Postcode must be at least 5 characters' }),
  type: z.string().min(3, { message: 'Type must be at least 3 characters' }),
  price: z.string().min(1, { message: 'Price is required' }),
  bedrooms: z.string().min(1, { message: 'Number of bedrooms is required' }),
  hasGarden: z.boolean().optional(),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

interface PropertyFormFieldProps {
  type: FormFieldType;
  name: keyof PropertyFormValues;
  label: string;
  description?: string;
}

export const PropertyFormField: React.FC<PropertyFormFieldProps> = ({
  type,
  name,
  label,
  description
}) => {
  switch (type) {
    case "text":
      return (
        <FormField
          control={formContext => formContext.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input placeholder={label} {...field} />
              </FormControl>
              {description && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "checkbox":
      return (
        <FormField
          control={formContext => formContext.control}
          name={name}
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{label}</FormLabel>
                {description && <FormDescription>{description}</FormDescription>}
              </div>
            </FormItem>
          )}
        />
      );
    case "textarea":
      return (
        <FormField
          control={formContext => formContext.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Textarea placeholder={label} {...field} />
              </FormControl>
              {description && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
      );
    default:
      return null;
  }
};
