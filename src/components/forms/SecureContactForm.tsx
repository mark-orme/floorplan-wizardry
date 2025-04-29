
import React from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { sanitizeHtml } from '@/utils/sanitizeHtml';

/**
 * Secure contact form schema with validation
 */
const secureContactSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be less than 50 characters" }),
  email: z.string()
    .email({ message: "Please enter a valid email address" }),
  phone: z.string()
    .min(7, { message: "Phone number must be at least 7 characters" })
    .max(15, { message: "Phone number must be less than 15 characters" }),
  message: z.string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(500, { message: "Message must be less than 500 characters" }),
  consent: z.boolean()
    .refine(val => val, { message: "You must agree to the terms and conditions" })
});

type SecureContactFormValues = z.infer<typeof secureContactSchema>;

/**
 * Secure contact form with XSS protection
 */
export const SecureContactForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SecureContactFormValues>({
    resolver: zodResolver(secureContactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      consent: false
    }
  });

  const onSubmit = (data: SecureContactFormValues) => {
    // Sanitize inputs to prevent XSS
    const sanitizedData = {
      ...data,
      name: sanitizeHtml(data.name),
      email: sanitizeHtml(data.email),
      phone: sanitizeHtml(data.phone),
      message: sanitizeHtml(data.message)
    };

    console.log('Form submitted:', sanitizedData);
    toast.success('Form submitted successfully!');
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
        <Input
          id="name"
          {...register('name')}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          className={errors.phone ? 'border-red-500' : ''}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
        <Textarea
          id="message"
          {...register('message')}
          className={errors.message ? 'border-red-500' : ''}
          rows={4}
        />
        {errors.message && (
          <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="consent"
          type="checkbox"
          {...register('consent')}
          className="h-4 w-4 mr-2"
        />
        <label htmlFor="consent" className="text-sm">
          I agree to the terms and conditions
        </label>
      </div>
      {errors.consent && (
        <p className="text-red-500 text-xs mt-1">{errors.consent.message}</p>
      )}

      <Button type="submit" className="w-full">Submit</Button>
    </form>
  );
};
