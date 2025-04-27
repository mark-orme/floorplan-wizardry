
import React from 'react';
import { Icons } from '@/constants/iconMappings';

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
          {check.status === 'loading' && <Icons.loading className="animate-spin" />}
          {check.status === 'success' && <Icons.check className="text-green-500" />}
          {check.status === 'error' && <Icons.warning className="text-red-500" />}
          <span>{check.message}</span>
        </li>
      ))}
    </ul>
  );
};
