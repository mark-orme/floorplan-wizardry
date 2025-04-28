
import React from 'react';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the form schema using Zod
const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
  acceptTerms: z.boolean().refine(val => val === true, { message: 'You must accept the terms' }),
});

// Infer the type from the schema
type ContactFormValues = z.infer<typeof contactFormSchema>;

export const SecureContactForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      acceptTerms: false,
    }
  });

  const onSubmit = (data: ContactFormValues) => {
    // Securely handle the form submission
    console.log('Form submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium pb-1">Name</label>
        <Input id="name" {...register('name')} className={errors.name ? 'border-red-500' : ''} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium pb-1">Email</label>
        <Input id="email" type="email" {...register('email')} className={errors.email ? 'border-red-500' : ''} />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>
      
      <div>
        <label htmlFor="subject" className="block text-sm font-medium pb-1">Subject</label>
        <Input id="subject" {...register('subject')} className={errors.subject ? 'border-red-500' : ''} />
        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium pb-1">Message</label>
        <textarea 
          id="message" 
          {...register('message')} 
          rows={4} 
          className={`w-full p-2 border rounded-md ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
        ></textarea>
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>
      
      <div className="flex items-center">
        <input 
          type="checkbox" 
          id="acceptTerms" 
          {...register('acceptTerms')} 
          className={`mr-2 ${errors.acceptTerms ? 'border-red-500' : ''}`}
        />
        <label htmlFor="acceptTerms" className="text-sm">I accept the terms and conditions</label>
      </div>
      {errors.acceptTerms && <p className="text-red-500 text-xs">{errors.acceptTerms.message}</p>}
      
      <Button type="submit">Send Message</Button>
    </form>
  );
};
