
import React from 'react';
import * as z from '@/utils/zod-mock';
import { validateFieldEnhanced } from '@/utils/form-validation';

interface ValidationDemoFormProps {
  onSubmit: (data: FormData) => void;
}

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
}

const ValidationDemoForm: React.FC<ValidationDemoFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = React.useState<FormData>({
    username: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  
  const validateForm = () => {
    const usernameSchema = z.string().min(3);
    const passwordSchema = z.string().min(8);
    const confirmPasswordSchema = z.string();
    
    const schema = {
      username: validateFieldEnhanced(usernameSchema, formData.username),
      password: validateFieldEnhanced(passwordSchema, formData.password),
      confirmPassword: validateFieldEnhanced(confirmPasswordSchema, formData.confirmPassword)
    };
    
    const newErrors: Record<string, string> = {};
    
    if (!schema.username.isValid) newErrors.username = schema.username.error || 'Invalid username';
    if (!schema.password.isValid) newErrors.password = schema.password.error || 'Invalid password';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
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

export default ValidationDemoForm;
