
import React from 'react';
import { Input } from '@/components/ui/input';
import { AiOutlineSearch } from 'react-icons/ai';

export const PropertySearch: React.FC<{
  onSearch: (term: string) => void;
  placeholder?: string;
}> = ({ 
  onSearch,
  placeholder = "Search properties..." 
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="relative">
      <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        className="pl-9"
        placeholder={placeholder}
        onChange={handleInputChange}
      />
    </div>
  );
};
