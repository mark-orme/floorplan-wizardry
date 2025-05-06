import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface CollaborationToggleProps {
  roomId: string;
  userId: string;
  onToggle: (enabled: boolean) => void;
}

export const CollaborationToggle: React.FC<CollaborationToggleProps> = ({ roomId, userId, onToggle }) => {
  const [enabled, setEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Load initial state from localStorage
    const storedState = localStorage.getItem(`collaboration_${roomId}`);
    if (storedState) {
      setEnabled(JSON.parse(storedState));
    }
  }, [roomId]);
  
  const toggleCollaboration = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newState = !enabled;
      setEnabled(newState);
      localStorage.setItem(`collaboration_${roomId}`, JSON.stringify(newState));
      onToggle(newState);
      
      toast.success(`Collaboration ${newState ? 'enabled' : 'disabled'}`);
    } catch (error: unknown) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleError = (error: unknown) => {
    // Type guard to ensure error is properly typed
    let errorMessage: string;
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else {
      errorMessage = 'An unknown error occurred';
    }
    
    // Now errorMessage is guaranteed to be a string
    toast.error(errorMessage);
  };
  
  return (
    <button
      onClick={toggleCollaboration}
      disabled={isLoading}
      className={`px-4 py-2 rounded-md ${
        enabled ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
    >
      {isLoading ? 'Loading...' : `Collaboration ${enabled ? 'Enabled' : 'Disabled'}`}
    </button>
  );
};
