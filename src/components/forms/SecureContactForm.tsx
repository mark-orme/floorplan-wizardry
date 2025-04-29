import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

// Define the form schema using Zod
const secureContactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  agreeToTerms: z.boolean().refine(val => val === true, { message: "You must agree to the terms" })
});

// Infer the type from the schema
type SecureContactFormValues = z.infer<typeof secureContactSchema>;

export const SecureContactForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SecureContactFormValues>({
    resolver: zodResolver(secureContactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      agreeToTerms: false,
    }
  });

  const onSubmit = (data: SecureContactFormValues) => {
    // Securely handle the form submission
    console.log('Form submitted:', data);
  };

  return (
    <div className="w-full max-w-md mx-auto">
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
          <Textarea 
            id="message" 
            {...register('message')} 
            rows={4} 
            className={`w-full p-2 border rounded-md ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
          ></Textarea>
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
        </div>
        
        <div className="flex items-center">
          <Checkbox 
            id="agreeToTerms" 
            {...register('agreeToTerms')} 
            className={`mr-2 ${errors.agreeToTerms ? 'border-red-500' : ''}`}
          />
          <label htmlFor="agreeToTerms" className="text-sm">I agree to the terms</label>
        </div>
        {errors.agreeToTerms && <p className="text-red-500 text-xs">{errors.agreeToTerms.message}</p>}
        
        <Button type="submit">Send Message</Button>
      </form>
    </div>
  );
};
