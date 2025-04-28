import { z } from 'zod';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { FormFieldType } from '@/types/forms';

interface PropertyFormFieldProps {
  type: FormFieldType;
  name: string;
  label: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  register: any;
  errors: any;
  required?: boolean;
}

export const PropertyFormFields: React.FC<PropertyFormFieldProps> = ({
  type,
  name,
  label,
  placeholder,
  options,
  register,
  errors,
  required = false
}) => {
  return (
    <div className="grid w-full gap-2">
      <Label htmlFor={name}>{label}</Label>
      {type === 'text' && (
        <Input
          type="text"
          id={name}
          placeholder={placeholder}
          {...register(name, { required })}
        />
      )}
      {type === 'textarea' && (
        <Textarea
          id={name}
          placeholder={placeholder}
          {...register(name, { required })}
        />
      )}
      {type === 'checkbox' && (
        <Checkbox
          id={name}
          {...register(name, { required })}
        />
      )}
      {type === 'select' && options && (
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder || label} {...register(name, { required })} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {type === 'date' && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !errors[name] && 'text-muted-foreground'
              )}
            >
              {errors[name] ? (
                format(errors[name], 'PPP')
              ) : (
                <span>{placeholder || 'Pick a date'}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={errors[name]}
              onSelect={(date) => {
                register(name).onChange(date);
              }}
              disabled={(date) =>
                date > new Date()
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}
      {errors[name] && (
        <p className="text-sm text-red-500">{errors[name]?.message}</p>
      )}
    </div>
  );
};
