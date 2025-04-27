
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface AccountSettingsProps {
  user: User;
  onSave: (data: AccountSettingsData) => Promise<void>;
  onAvatarChange?: (file: File) => Promise<void>;
}

interface AccountSettingsData {
  fullName: string;
  email: string;
}

export const AccountSettings = ({
  user,
  onSave,
  onAvatarChange
}: AccountSettingsProps): JSX.Element => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            value={user.email}
            disabled
            className="bg-muted"
          />
        </div>
      </CardContent>
    </Card>
  );
};
