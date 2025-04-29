
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

// Define schema using Zod
const schema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  subject: z.string().min(3, { message: "Subject is required" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  agreeToTerms: z.boolean().refine(val => val === true, { message: "You must agree to terms" }),
});

// Infer TypeScript type from schema
type FormData = z.infer<typeof schema>;

interface SecureContactFormProps {
  onSubmit?: (data: FormData) => void;
}

export const SecureContactForm: React.FC<SecureContactFormProps> = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      agreeToTerms: false,
    },
  });

  const submitHandler = (data: FormData) => {
    console.log("Form Data:", data);
    onSubmit?.(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="max-w-md mx-auto mt-8 space-y-6">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          {...register("name")}
          placeholder="Your Name"
          className={`w-full ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          {...register("email")}
          placeholder="Your Email"
          className={`w-full ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input
          type="text"
          id="subject"
          {...register("subject")}
          placeholder="Subject"
          className={`w-full ${errors.subject ? 'border-red-500' : ''}`}
        />
        {errors.subject && <p className="text-red-500 text-sm">{errors.subject.message}</p>}
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={4}
          {...register("message")}
          placeholder="Your Message"
          className={`w-full ${errors.message ? 'border-red-500' : ''}`}
        />
        {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="terms" {...register("agreeToTerms")} />
        <Label htmlFor="terms">
          I agree to the <a href="#" className="text-blue-500">Terms and Conditions</a>
        </Label>
        {errors.agreeToTerms && <p className="text-red-500 text-sm">{errors.agreeToTerms.message}</p>}
      </div>

      <Button type="submit" className="w-full">
        Send Message
      </Button>
    </form>
  );
};
