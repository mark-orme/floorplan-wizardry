
import React from 'react';
import * as z from '@/utils/zod-mock';
import { validateField } from '@/utils/form-validation';

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
    
    // Use our fixed validateField function with values
    const usernameResult = validateField(usernameSchema, formData.username);
    const passwordResult = validateField(passwordSchema, formData.password);
    const confirmPasswordResult = validateField(confirmPasswordSchema, formData.confirmPassword);
    
    const newErrors: Record<string, string> = {};
    
    if (!usernameResult.isValid) newErrors.username = usernameResult.error || 'Invalid username';
    if (!passwordResult.isValid) newErrors.password = passwordResult.error || 'Invalid password';
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
