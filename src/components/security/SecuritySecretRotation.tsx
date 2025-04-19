
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { getSecretsToRotate, rotateSecret } from '@/utils/security/secretManager';
import { toast } from 'sonner';
import { RefreshCw, Key, AlertTriangle, Clock } from 'lucide-react';

interface Secret {
  name: string;
  lastRotated: Date;
  daysUntilRotation: number;
  isOverdue: boolean;
}

export function SecuritySecretRotation() {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load secrets that need rotation
  useEffect(() => {
    const loadSecrets = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would fetch actual secrets from a backend
        // For this demo, we'll mock it
        const mockSecrets = [
          {
            name: 'API_KEY',
            lastRotated: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000), // 80 days ago
            daysUntilRotation: 10,
            isOverdue: false
          },
          {
            name: 'DATABASE_PASSWORD',
            lastRotated: new Date(Date.now() - 105 * 24 * 60 * 60 * 1000), // 105 days ago
            daysUntilRotation: -15, // Overdue by 15 days
            isOverdue: true
          },
          {
            name: 'JWT_SECRET',
            lastRotated: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
            daysUntilRotation: 70,
            isOverdue: false
          }
        ];
        
        setSecrets(mockSecrets);
      } catch (error) {
        console.error('Error loading secrets:', error);
        toast.error('Failed to load secrets');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSecrets();
  }, []);
  
  const handleRotateSecret = async (secretName: string) => {
    try {
      // In a real app, this would call the actual secret rotation
      // For this demo, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the UI
      setSecrets(prev => 
        prev.map(secret => 
          secret.name === secretName
            ? {
                ...secret,
                lastRotated: new Date(),
                daysUntilRotation: 90,
                isOverdue: false
              }
            : secret
        )
      );
      
      toast.success(`Secret ${secretName} rotated successfully`);
    } catch (error) {
      console.error('Error rotating secret:', error);
      toast.error(`Failed to rotate secret ${secretName}`);
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Secret Rotation</h3>
        <p className="text-gray-600">
          Regularly rotate secrets to minimize the risk of unauthorized access.
        </p>
      </div>
      
      <div className="space-y-4">
        {secrets.map((secret) => (
          <div key={secret.name} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <Key className="h-5 w-5 text-gray-500" />
                  <h4 className="ml-2 font-medium">{secret.name}</h4>
                  {secret.isOverdue && (
                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                      Overdue
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 mt-1">
                  Last rotated: {formatDate(secret.lastRotated.toISOString())}
                </div>
                
                <div className="mt-2 flex items-center">
                  {secret.isOverdue ? (
                    <div className="flex items-center text-red-600 text-sm">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Overdue by {Math.abs(secret.daysUntilRotation)} days
                    </div>
                  ) : (
                    <div className="flex items-center text-blue-600 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      Rotate in {secret.daysUntilRotation} days
                    </div>
                  )}
                </div>
              </div>
              
              <Button 
                variant={secret.isOverdue ? "default" : "outline"} 
                size="sm"
                onClick={() => handleRotateSecret(secret.name)}
              >
                Rotate Now
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium mb-2">Best Practices for Secret Rotation</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Rotate all secrets at least every 90 days</li>
          <li>Use separate secrets for different environments</li>
          <li>Store secrets in a secure vault, not in code</li>
          <li>Automate rotation when possible</li>
          <li>Use strong, randomly generated secrets</li>
        </ul>
      </div>
    </div>
  );
}
