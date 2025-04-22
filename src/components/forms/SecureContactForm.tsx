
/**
 * SecureContactForm Component
 * Example form using security and validation features
 */
import React from 'react';
import { useSecureForm } from '@/hooks/useSecureForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { z } from '@/utils/zod-mock';

// Define form schema using Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" })
});

type ContactFormValues = z.infer<typeof formSchema>;

interface SecureContactFormProps {
  onSubmitSuccess?: () => void;
  className?: string;
}

export const SecureContactForm: React.FC<SecureContactFormProps> = ({
  onSubmitSuccess,
  className = ''
}) => {
  const {
    data,
    errors,
    touched,
    isSubmitting,
    isValid,
    setField,
    handleSubmit,
    resetForm
  } = useSecureForm<ContactFormValues>(formSchema, {
    initialValues: {
      name: '',
      email: '',
      phone: '',
      message: ''
    },
    onSubmit: async (data) => {
      // Simulate API call
      console.log('Submitting contact form:', data);
      
      // For demo purposes, just show a success toast
      toast.success('Message sent successfully!');
      
      // Reset form after successful submission
      resetForm();
      
      // Call success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    },
    onValidationError: (errors) => {
      // Show validation error toast
      toast.error('Please fix the errors in the form');
      console.error('Form validation errors:', errors);
    }
  });
  
  return (
    <form onSubmit={(e) => handleSubmit(e)} className={`space-y-6 ${className}`}>
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Name</label>
        <Input
          id="name"
          value={data.name || ''}
          onChange={(e) => setField('name', e.target.value)}
          aria-invalid={touched.name && !!errors.name}
          aria-describedby="name-error"
        />
        {touched.name && errors.name && (
          <p id="name-error" className="text-sm text-red-500">{errors.name[0]}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <Input
          id="email"
          type="email"
          value={data.email || ''}
          onChange={(e) => setField('email', e.target.value)}
          aria-invalid={touched.email && !!errors.email}
          aria-describedby="email-error"
        />
        {touched.email && errors.email && (
          <p id="email-error" className="text-sm text-red-500">{errors.email[0]}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">Phone</label>
        <Input
          id="phone"
          value={data.phone || ''}
          onChange={(e) => setField('phone', e.target.value)}
          aria-invalid={touched.phone && !!errors.phone}
          aria-describedby="phone-error"
        />
        {touched.phone && errors.phone && (
          <p id="phone-error" className="text-sm text-red-500">{errors.phone[0]}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">Message</label>
        <Textarea
          id="message"
          value={data.message || ''}
          onChange={(e) => setField('message', e.target.value)}
          rows={5}
          aria-invalid={touched.message && !!errors.message}
          aria-describedby="message-error"
        />
        {touched.message && errors.message && (
          <p id="message-error" className="text-sm text-red-500">{errors.message[0]}</p>
        )}
      </div>
      
      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={resetForm}
          disabled={isSubmitting}
        >
          Reset
        </Button>
      </div>
    </form>
  );
};
