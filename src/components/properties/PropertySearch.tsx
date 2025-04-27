
import { Input } from '@/components/ui/input';
import { AiOutlineSearch } from 'react-icons/ai';

interface PropertySearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const PropertySearch = ({ searchTerm, onSearchChange }: PropertySearchProps) => {
  return (
    <div className="mb-6">
      <div className="relative">
        <AiOutlineSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by order ID, address or client..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};
