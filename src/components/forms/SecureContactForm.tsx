
import React from 'react';
import * as z from '@/utils/zod-mock';
import { validateFieldEnhanced } from '@/utils/form-validation';

interface SecureContactFormProps {
  onSubmit: (data: FormData) => void;
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

const SecureContactForm: React.FC<SecureContactFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  
  const validate = () => {
    const nameSchema = z.string().min(2);
    const emailSchema = z.string().min(1).email();
    const messageSchema = z.string().min(10);
    
    const schema = {
      name: validateFieldEnhanced(nameSchema, formData.name),
      email: validateFieldEnhanced(emailSchema, formData.email),
      message: validateFieldEnhanced(messageSchema, formData.message)
    };
    
    const newErrors: Record<string, string> = {};
    
    if (!schema.name.isValid) newErrors.name = schema.name.error || 'Invalid name';
    if (!schema.email.isValid) newErrors.email = schema.email.error || 'Invalid email';
    if (!schema.message.isValid) newErrors.message = schema.message.error || 'Invalid message';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form content */}
      <div>This is a mock form for testing</div>
    </form>
  );
};

export default SecureContactForm;
