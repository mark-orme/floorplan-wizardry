
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel, 
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
// Remove missing imports
// import { validateAndSanitizeForm, appSchemas, trackValidationFailure } from "@/utils/validation/inputValidation";
import { InputValidationResult } from "@/utils/validation/inputValidation";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define validation schema directly since we can't import it
const propertyFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  address: z.string().min(5, { message: "Address is required" }),
  description: z.string().optional(),
  isCommercial: z.boolean().default(false),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

interface PropertyFormProps {
  initialValues?: Partial<PropertyFormValues>;
  onSubmit?: (values: PropertyFormValues) => void;
  onCancel?: () => void;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  initialValues = {},
  onSubmit,
  onCancel
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: initialValues.name || "",
      address: initialValues.address || "",
      description: initialValues.description || "",
      isCommercial: initialValues.isCommercial || false,
    },
  });

  const handleSubmit = async (values: PropertyFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simple validation replacing the missing validateAndSanitizeForm
      const validationResult: InputValidationResult = {
        valid: true,
        errors: []
      };
      
      // Check for empty required fields
      if (!values.name.trim()) {
        validationResult.valid = false;
        validationResult.errors = validationResult.errors || [];
        validationResult.errors.push("Name is required");
      }
      
      if (!values.address.trim()) {
        validationResult.valid = false;
        validationResult.errors = validationResult.errors || [];
        validationResult.errors.push("Address is required");
      }
      
      if (!validationResult.valid) {
        // Handle validation errors
        if (validationResult.errors && validationResult.errors.length > 0) {
          toast.error(validationResult.errors[0]);
        } else {
          toast.error("Please check form for errors");
        }
        setIsSubmitting(false);
        return;
      }
      
      if (onSubmit) {
        onSubmit(values);
        toast.success("Property saved successfully");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An error occurred while saving the property");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter property name" {...field} />
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
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the property" 
                  {...field} 
                  className="min-h-32"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isCommercial"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Commercial Property</FormLabel>
                <FormDescription>
                  Check if this is a commercial property
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Property"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PropertyForm;
