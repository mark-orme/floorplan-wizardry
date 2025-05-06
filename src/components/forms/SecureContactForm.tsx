
import React from 'react';
import * as z from '@/utils/zod-mock';
import { validateField } from '@/utils/form-validation';

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
    
    const newErrors: Record<string, string> = {};
    
    // Use our fixed validateField function
    const nameResult = validateField(nameSchema, formData.name);
    const emailResult = validateField(emailSchema, formData.email);
    const messageResult = validateField(messageSchema, formData.message);
    
    if (!nameResult.isValid) newErrors.name = nameResult.error || 'Invalid name';
    if (!emailResult.isValid) newErrors.email = emailResult.error || 'Invalid email';
    if (!messageResult.isValid) newErrors.message = messageResult.error || 'Invalid message';
    
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
