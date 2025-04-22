
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { StylusCurveVisualizer } from './StylusCurveVisualizer';
import { StylusProfile, DEFAULT_STYLUS_PROFILE } from '@/types/core/StylusProfile';
import { 
  getAllProfiles, 
  getActiveProfile, 
  saveProfile, 
  deleteProfile, 
  setActiveProfile 
} from '@/utils/stylus/stylusProfileService';
import { v4 as uuidv4 } from 'uuid';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Pencil, Save, Trash2, Plus } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, 'Profile name is required'),
  useTilt: z.boolean().default(false),
});

export function PencilCalibrationDialog({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [profiles, setProfiles] = useState<StylusProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>('default');
  const [currentProfile, setCurrentProfile] = useState<StylusProfile>(DEFAULT_STYLUS_PROFILE);
  const [pressureCurve, setPressureCurve] = useState<number[]>([0, 0.25, 0.5, 0.75, 1]);
  const [tiltCurve, setTiltCurve] = useState<number[]>([0, 0.25, 0.5, 0.75, 1]);
  const [calibrationMode, setCalibrationMode] = useState<'view' | 'draw' | 'test'>('view');
  const [liveTestPressure, setLiveTestPressure] = useState<number>(0.5);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentProfile.name,
      useTilt: !!currentProfile.tiltCurve,
    },
  });
  
  // Load profiles on initial render
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const allProfiles = await getAllProfiles();
        setProfiles(allProfiles);
        
        const active = await getActiveProfile();
        setActiveProfileId(active.id);
        setCurrentProfile(active);
        setPressureCurve(active.pressureCurve);
        setTiltCurve(active.tiltCurve || [0, 0.25, 0.5, 0.75, 1]);
        
        form.reset({
          name: active.name,
          useTilt: !!active.tiltCurve,
        });
      } catch (error) {
        console.error('Error loading profiles:', error);
        toast.error('Failed to load stylus profiles');
      }
    };
    
    if (open) {
      loadProfileData();
    }
  }, [open, form]);
  
  // Select a profile
  const handleSelectProfile = useCallback(async (profileId: string) => {
    try {
      // Find the profile in the loaded profiles
      const selectedProfile = profiles.find(p => p.id === profileId);
      
      if (selectedProfile) {
        setCurrentProfile(selectedProfile);
        setPressureCurve(selectedProfile.pressureCurve);
        setTiltCurve(selectedProfile.tiltCurve || [0, 0.25, 0.5, 0.75, 1]);
        
        form.reset({
          name: selectedProfile.name,
          useTilt: !!selectedProfile.tiltCurve,
        });
        
        setActiveProfileId(profileId);
        setActiveProfile(profileId);
      }
    } catch (error) {
      console.error('Error selecting profile:', error);
      toast.error('Failed to select profile');
    }
  }, [profiles, form]);
  
  // Create a new profile
  const handleCreateProfile = useCallback(() => {
    const newProfile: StylusProfile = {
      id: uuidv4(),
      name: 'New Profile',
      pressureCurve: [0, 0.25, 0.5, 0.75, 1],
      lastCalibrated: new Date()
    };
    
    setCurrentProfile(newProfile);
    setPressureCurve(newProfile.pressureCurve);
    setTiltCurve([0, 0.25, 0.5, 0.75, 1]);
    
    form.reset({
      name: newProfile.name,
      useTilt: false,
    });
    
    // Switch to calibration mode
    setCalibrationMode('draw');
    
    toast.success('New profile created. Draw a line to calibrate.');
  }, [form]);
  
  // Save the current profile
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const updatedProfile: StylusProfile = {
        ...currentProfile,
        name: values.name,
        pressureCurve,
        tiltCurve: values.useTilt ? tiltCurve : undefined,
        lastCalibrated: new Date()
      };
      
      const success = await saveProfile(updatedProfile);
      
      if (success) {
        // Refresh profiles list
        const allProfiles = await getAllProfiles();
        setProfiles(allProfiles);
        setCurrentProfile(updatedProfile);
        setActiveProfileId(updatedProfile.id);
        setActiveProfile(updatedProfile.id);
        
        toast.success('Profile saved successfully');
        setCalibrationMode('view');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    }
  };
  
  // Delete the current profile
  const handleDeleteProfile = async () => {
    if (currentProfile.id === 'default') {
      toast.error('Cannot delete the default profile');
      return;
    }
    
    try {
      const success = await deleteProfile(currentProfile.id);
      
      if (success) {
        // Switch to default profile
        const allProfiles = await getAllProfiles();
        setProfiles(allProfiles);
        
        const defaultProfile = allProfiles.find(p => p.id === 'default') || DEFAULT_STYLUS_PROFILE;
        setCurrentProfile(defaultProfile);
        setPressureCurve(defaultProfile.pressureCurve);
        setTiltCurve(defaultProfile.tiltCurve || [0, 0.25, 0.5, 0.75, 1]);
        
        form.reset({
          name: defaultProfile.name,
          useTilt: !!defaultProfile.tiltCurve,
        });
        
        setActiveProfileId('default');
        setActiveProfile('default');
        
        toast.success('Profile deleted');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error('Failed to delete profile');
    }
  };
  
  // Reset to default curve
  const handleResetCurve = () => {
    setPressureCurve([0, 0.25, 0.5, 0.75, 1]);
    setTiltCurve([0, 0.25, 0.5, 0.75, 1]);
    toast.info('Curves reset to default');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pencil Settings & Calibration</DialogTitle>
          <DialogDescription>
            Customize your stylus pressure sensitivity and calibration to get the perfect feel for your drawing style.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Panel - Profiles */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profiles</CardTitle>
                <CardDescription>Select or create a profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-col space-y-2">
                  {profiles.map(profile => (
                    <Button
                      key={profile.id}
                      variant={profile.id === activeProfileId ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => handleSelectProfile(profile.id)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      {profile.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleCreateProfile}
                  className="w-full"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Profile
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Right Panel - Calibration */}
          <div className="md:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="useTilt"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Use Tilt for Width</FormLabel>
                          <FormDescription>
                            Adjust stroke width based on pen tilt
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Pressure Curve</h3>
                    <p className="text-sm text-gray-500">
                      Adjust how pressure affects stroke width
                    </p>
                    <StylusCurveVisualizer 
                      curve={pressureCurve}
                      onChange={setPressureCurve}
                      className="mt-2"
                      editable={calibrationMode !== 'draw'}
                    />
                  </div>
                  
                  {form.watch('useTilt') && (
                    <div>
                      <h3 className="text-lg font-medium">Tilt Curve</h3>
                      <p className="text-sm text-gray-500">
                        Adjust how pen tilt affects stroke width
                      </p>
                      <StylusCurveVisualizer 
                        curve={tiltCurve}
                        onChange={setTiltCurve}
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Live Test</h3>
                  <p className="text-sm text-gray-500">
                    Test your stylus pressure settings
                  </p>
                  
                  <div className="border rounded-md p-4 bg-white">
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${liveTestPressure * 100}%` }}
                      />
                    </div>
                    <div className="mt-4">
                      <Slider 
                        value={[liveTestPressure * 100]}
                        onValueChange={(values) => setLiveTestPressure(values[0] / 100)}
                        min={0}
                        max={100}
                        step={1}
                      />
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>Light</span>
                        <span>Medium</span>
                        <span>Heavy</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    {currentProfile.id !== 'default' && (
                      <Button 
                        type="button" 
                        variant="destructive"
                        onClick={handleDeleteProfile}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Profile
                      </Button>
                    )}
                  </div>
                  <div className="space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResetCurve}
                    >
                      Reset Curves
                    </Button>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Save Profile
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
