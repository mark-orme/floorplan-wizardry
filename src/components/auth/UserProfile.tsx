
import { User } from '@supabase/supabase-js';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserProfileProps {
  user: User;
  className?: string;
}

export const UserProfile = ({ user, className }: UserProfileProps): JSX.Element => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <img
              src={user.user_metadata?.avatar_url ?? `https://ui-avatars.com/api/?name=${user.email}`}
              alt={user.email ?? 'User avatar'}
            />
          </Avatar>
          <div>
            <div className="font-medium">{user.email}</div>
            <div className="text-sm text-muted-foreground">
              Member since {new Date(user.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
