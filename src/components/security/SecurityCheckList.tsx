
import React from 'react';
import { 
  AiOutlineLoading, 
  AiOutlineCheckCircle, 
  AiOutlineWarning 
} from 'react-icons/ai';

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
          {check.status === 'loading' && <AiOutlineLoading className="animate-spin" />}
          {check.status === 'success' && <AiOutlineCheckCircle className="text-green-500" />}
          {check.status === 'error' && <AiOutlineWarning className="text-red-500" />}
          <span>{check.message}</span>
        </li>
      ))}
    </ul>
  );
};
