
import React, { useState, useEffect } from 'react';
import { listSecrets, getSecretsToRotate } from '@/utils/security/secretManager';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface SecretInfo {
  name: string;
  needsRotation: boolean;
  lastRotated?: string;
}

export const SecuritySecretRotation: React.FC = () => {
  const [secrets, setSecrets] = useState<SecretInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRotating, setIsRotating] = useState(false);
  
  useEffect(() => {
    // Load secrets on mount
    loadSecrets();
  }, []);
  
  const loadSecrets = () => {
    try {
      setIsLoading(true);
      
      // Get all secrets
      const allSecrets = listSecrets();
      
      // Get secrets that need rotation
      const secretsToRotate = getSecretsToRotate(30); // 30 days rotation policy
      
      // Build secret info objects
      const secretInfos: SecretInfo[] = allSecrets.map(name => {
        return {
          name,
          needsRotation: secretsToRotate.includes(name),
          // In a real app, we would get the actual last rotated date
          lastRotated: 'Unknown'
        };
      });
      
      setSecrets(secretInfos);
    } catch (error) {
      console.error('Error loading secrets:', error);
      toast.error('Failed to load secrets information');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRotate = (secretName: string) => {
    // In a real app, this would trigger the actual rotation
    setIsRotating(true);
    
    setTimeout(() => {
      toast.success(`Secret ${secretName} has been rotated!`);
      
      // Update the list
      setSecrets(prev => prev.map(s => 
        s.name === secretName 
          ? { ...s, needsRotation: false, lastRotated: new Date().toLocaleDateString() }
          : s
      ));
      
      setIsRotating(false);
    }, 1000);
  };
  
  if (isLoading) {
    return <div>Loading secrets...</div>;
  }
  
  if (secrets.length === 0) {
    return (
      <div className="p-4 border rounded bg-gray-50">
        <h3 className="text-lg font-medium">Secret Rotation</h3>
        <p className="text-gray-600 mt-2">No secrets found to manage.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Secret Rotation</h2>
        <Button
          variant="outline"
          onClick={loadSecrets}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </div>
      
      <div className="space-y-2">
        {secrets.map(secret => (
          <div 
            key={secret.name}
            className="p-3 border rounded shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{secret.name}</h3>
                <p className="text-xs text-gray-500">
                  Last rotated: {secret.lastRotated || 'Never'}
                </p>
              </div>
              <div>
                {secret.needsRotation ? (
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded mr-2">
                    Needs Rotation
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded mr-2">
                    Current
                  </span>
                )}
                <Button
                  size="sm"
                  onClick={() => handleRotate(secret.name)}
                  disabled={isRotating || !secret.needsRotation}
                >
                  Rotate
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-sm text-gray-600 mt-4 p-3 bg-blue-50 rounded">
        <h4 className="font-medium">About Secret Rotation</h4>
        <p className="mt-1">
          Security best practice is to rotate secrets regularly to minimize the impact of potential 
          credential leakage. Secrets should be rotated at least every 90 days, or immediately
          if there's any suspicion of compromise.
        </p>
      </div>
    </div>
  );
};

export default SecuritySecretRotation;
