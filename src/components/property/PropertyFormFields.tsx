
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

interface PropertyFormFieldsProps {
  propertyData: any;
  onChange: (field: string, value: any) => void;
  onSubmit?: () => void;
  showAdvanced?: boolean;
}

export const PropertyFormFields: React.FC<PropertyFormFieldsProps> = ({
  propertyData,
  onChange,
  onSubmit,
  showAdvanced = false
}) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.name, e.target.value);
  };
  
  const handleSelectChange = (field: string, value: string) => {
    onChange(field, value);
  };
  
  const handleCheckboxChange = (field: string, checked: boolean) => {
    onChange(field, checked);
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input 
            id="address" 
            name="address" 
            value={propertyData.address || ''} 
            onChange={handleTextChange} 
            placeholder="Enter address"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postcode">Post Code</Label>
          <Input 
            id="postcode" 
            name="postcode" 
            value={propertyData.postcode || ''} 
            onChange={handleTextChange} 
            placeholder="Enter post code"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="propertyType">Property Type</Label>
        <Select 
          value={propertyData.propertyType || ''} 
          onValueChange={(value) => handleSelectChange('propertyType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select property type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="detached">Detached</SelectItem>
            <SelectItem value="semiDetached">Semi-Detached</SelectItem>
            <SelectItem value="terraced">Terraced</SelectItem>
            <SelectItem value="flat">Flat/Apartment</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end space-x-2">
        {onSubmit && (
          <Button type="button" onClick={onSubmit}>Save Property</Button>
        )}
        <Button type="button" variant="outline">Cancel</Button>
      </div>
      
      {showAdvanced && (
        <div className="pt-4 border-t mt-4">
          <h3 className="text-lg font-medium mb-3">Advanced Settings</h3>
          {/* Additional advanced fields would go here */}
        </div>
      )}
    </div>
  );
};
