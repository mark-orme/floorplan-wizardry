import React from 'react';
import { Icons } from '@/components/icons';

interface SecurityCheck {
  status: 'loading' | 'success' | 'error';
  message: string;
}

interface SecurityCheckListProps {
  checks: SecurityCheck[];
}

export const SecurityCheckList: React.FC<SecurityCheckListProps> = ({ checks }) => {
  return (
    <ul className="space-y-2">
      {checks.map((check, index) => (
        <li key={index} className="flex items-center gap-2">
          {check.status === 'loading' && <Icons.loader className="animate-spin" />}
          {check.status === 'success' && <Icons.checkCircle className="text-green-500" />}
          {check.status === 'error' && <Icons.alertTriangle className="text-red-500" />}
          <span>{check.message}</span>
        </li>
      ))}
    </ul>
  );
};
