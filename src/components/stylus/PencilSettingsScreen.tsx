
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { StylusProfile, DEFAULT_STYLUS_PROFILE } from '@/types/core/StylusProfile';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface StylusCurveVisualizerProps {
  pressureCurve: number[];
  onChange?: (newCurve: number[]) => void;
  readOnly?: boolean;
}

/**
 * Component to visualize and edit the pressure curve
 */
const StylusCurveVisualizer: React.FC<StylusCurveVisualizerProps> = ({
  pressureCurve,
  onChange,
  readOnly = false,
}) => {
  return (
    <div className="mt-4 p-4 border rounded-md">
      <div className="h-32 bg-gray-50 border relative">
        {pressureCurve.map((value, index) => {
          const x = (index / (pressureCurve.length - 1)) * 100;
          const y = 100 - value * 100;
          
          return (
            <div
              key={index}
              className={`absolute w-3 h-3 rounded-full bg-primary transform -translate-x-1/2 -translate-y-1/2 ${
                readOnly ? '' : 'cursor-grab'
              }`}
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseDown={readOnly ? undefined : (e) => {
                // Implement drag handling for point adjustment if not readOnly
                if (onChange) {
                  // Logic for adjusting points would go here
                }
              }}
            />
          );
        })}
        
        {/* Connect the points with lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <polyline
            points={pressureCurve
              .map((value, index) => {
                const x = (index / (pressureCurve.length - 1)) * 100;
                const y = 100 - value * 100;
                return `${x},${y}`;
              })
              .join(' ')}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />
        </svg>
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Light Pressure</span>
        <span>Heavy Pressure</span>
      </div>
    </div>
  );
};

interface PencilSettingsFormValues {
  profileName: string;
  useTiltForWidth: boolean;
}

/**
 * Pencil Settings screen component for stylus calibration
 */
export function PencilCalibrationDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [profiles, setProfiles] = useLocalStorage<StylusProfile[]>('stylus-profiles', [DEFAULT_STYLUS_PROFILE]);
  const [activeProfileId, setActiveProfileId] = useLocalStorage<string>('active-stylus-profile-id', DEFAULT_STYLUS_PROFILE.id);
  const [activeProfile, setActiveProfile] = useState<StylusProfile>(DEFAULT_STYLUS_PROFILE);
  const [editedCurve, setEditedCurve] = useState<number[]>([]);
  
  const form = useForm<PencilSettingsFormValues>({
    defaultValues: {
      profileName: '',
      useTiltForWidth: false,
    },
  });
  
  // Load the active profile when component mounts or activeProfileId changes
  useEffect(() => {
    const profile = profiles.find(p => p.id === activeProfileId) || DEFAULT_STYLUS_PROFILE;
    setActiveProfile(profile);
    setEditedCurve(profile.pressureCurve);
    form.reset({
      profileName: profile.name,
      useTiltForWidth: !!profile.tiltCurve,
    });
  }, [activeProfileId, profiles, form]);
  
  const handleSaveProfile = (values: PencilSettingsFormValues) => {
    // Update the current profile
    const updatedProfile: StylusProfile = {
      ...activeProfile,
      name: values.profileName,
      pressureCurve: editedCurve,
      tiltCurve: values.useTiltForWidth ? activeProfile.tiltCurve || [0, 0.25, 0.5, 0.75, 1] : undefined,
      lastCalibrated: new Date(),
    };
    
    // Update profiles array
    const updatedProfiles = profiles.map(p => 
      p.id === updatedProfile.id ? updatedProfile : p
    );
    
    setProfiles(updatedProfiles);
    toast.success('Pencil settings saved successfully');
  };
  
  const handleCreateNewProfile = () => {
    const newProfile: StylusProfile = {
      id: `profile-${Date.now()}`,
      name: `New Profile ${profiles.length + 1}`,
      pressureCurve: [...DEFAULT_STYLUS_PROFILE.pressureCurve],
      lastCalibrated: new Date(),
    };
    
    setProfiles([...profiles, newProfile]);
    setActiveProfileId(newProfile.id);
    toast.success('New profile created');
  };
  
  const handleResetToDefault = () => {
    setEditedCurve(DEFAULT_STYLUS_PROFILE.pressureCurve);
    toast.info('Pressure curve reset to default');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Pencil Settings</DialogTitle>
          <DialogDescription>
            Calibrate your stylus for optimal drawing experience. Adjust the pressure curve to match your drawing style.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSaveProfile)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormField
                  control={form.control}
                  name="profileName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Profile" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Select Profile</h4>
                  <div className="flex gap-2 flex-wrap">
                    {profiles.map(profile => (
                      <Button
                        key={profile.id}
                        variant={profile.id === activeProfileId ? 'default' : 'outline'}
                        onClick={() => setActiveProfileId(profile.id)}
                        size="sm"
                      >
                        {profile.name}
                      </Button>
                    ))}
                    <Button variant="outline" size="sm" onClick={handleCreateNewProfile}>
                      + New
                    </Button>
                  </div>
                </div>
              </div>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Active Profile</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="text-sm">
                    <p><span className="font-medium">Name:</span> {activeProfile.name}</p>
                    <p><span className="font-medium">Last Calibrated:</span> {new Date(activeProfile.lastCalibrated).toLocaleDateString()}</p>
                    <p><span className="font-medium">Uses Tilt:</span> {activeProfile.tiltCurve ? 'Yes' : 'No'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Pressure Curve</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Adjust how your pencil responds to different pressure levels. Drag points to customize.
              </p>
              
              <StylusCurveVisualizer 
                pressureCurve={editedCurve} 
                onChange={setEditedCurve}
              />
              
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pressure Response</span>
                  <Button variant="outline" size="sm" onClick={handleResetToDefault}>
                    Reset to Default
                  </Button>
                </div>
                <Slider 
                  defaultValue={[50]} 
                  max={100} 
                  step={1}
                  className="mt-2"
                  onValueChange={(values) => {
                    // Adjust the curve's "steepness" based on slider
                    const value = values[0] / 100;
                    const newCurve = editedCurve.map((point, index) => {
                      const position = index / (editedCurve.length - 1);
                      // Apply a weighting based on slider value
                      return Math.pow(position, 1 + (1 - value)) * 1.0;
                    });
                    setEditedCurve(newCurve);
                  }}
                />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Linear</span>
                  <span>Curved</span>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
