
/**
 * ValidationDemoForm
 * Demonstrates comprehensive form validation 
 */
import React from 'react';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ValidatedInput } from './ValidatedInput';
import { useValidatedForm } from '@/hooks/useValidatedForm';
import { captureError } from '@/utils/sentry';

// Define a validation schema using Zod
const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email cannot exceed 255 characters'),
  
  subject: z.string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject cannot exceed 200 characters'),
  
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message cannot exceed 2000 characters')
});

// Type derived from the schema
type ContactFormValues = z.infer<typeof contactFormSchema>;

/**
 * Demo form component showcasing validation capabilities
 */
export function ValidationDemoForm() {
  const {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    isDirty,
    setFieldValue,
    handleBlur,
    handleSubmit,
    resetForm
  } = useValidatedForm<ContactFormValues>({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    },
    schema: contactFormSchema,
    onSubmit: async (values) => {
      try {
        // Simulate API call
        console.log('Form submitted with values:', values);
        
        // Show success message
        toast.success('Message sent successfully!');
        
        // Reset form after success
        resetForm();
      } catch (error) {
        // Capture error for monitoring
        captureError(error, 'contact-form-submission-error', {
          extra: { formValues: values }
        });
        
        // Show error message
        toast.error('Failed to send message. Please try again.');
      }
    },
    onValidationError: (errors) => {
      // Show validation error toast
      toast.error('Please fix the errors in the form');
      console.error('Form validation errors:', errors);
    },
    validateOnChange: true,
    validateOnBlur: true,
    sanitizeValues: true
  });
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
        <CardDescription>
          Send us a message and we'll get back to you as soon as possible.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={(e) => handleSubmit(e)}>
        <CardContent className="space-y-4">
          <ValidatedInput
            label="Name"
            placeholder="Your name"
            value={values.name}
            error={touched.name && errors.name?.[0]}
            onValueChange={(value) => setFieldValue('name', value)}
            onBlur={() => handleBlur('name')}
            required
          />
          
          <ValidatedInput
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={values.email}
            error={touched.email && errors.email?.[0]}
            onValueChange={(value) => setFieldValue('email', value)}
            onBlur={() => handleBlur('email')}
            required
          />
          
          <ValidatedInput
            label="Subject"
            placeholder="Message subject"
            value={values.subject}
            error={touched.subject && errors.subject?.[0]}
            onValueChange={(value) => setFieldValue('subject', value)}
            onBlur={() => handleBlur('subject')}
            required
          />
          
          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              value={values.message}
              onChange={(e) => setFieldValue('message', e.target.value)}
              onBlur={() => handleBlur('message')}
              rows={5}
              className={`w-full rounded-md border ${
                touched.message && errors.message
                  ? 'border-destructive focus-visible:ring-destructive'
                  : 'border-input'
              } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
              placeholder="Your message"
              aria-invalid={!!(touched.message && errors.message)}
              required
            />
            {touched.message && errors.message && (
              <p className="text-sm font-medium text-destructive">
                {errors.message[0]}
              </p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={resetForm}
            disabled={isSubmitting || !isDirty}
          >
            Reset
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !isValid || !isDirty}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default ValidationDemoForm;
