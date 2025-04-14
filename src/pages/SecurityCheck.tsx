
/**
 * SecurityCheck Page
 * Shows the security status of the application
 */
import React from 'react';
import { Button } from '@/components/ui/button';
import { SecurityCheckList } from '@/components/security/SecurityCheckList';
import { useNavigate } from 'react-router-dom';

const SecurityCheck: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Frontend Security</h1>
        <Button variant="outline" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>

      <SecurityCheckList />
      
      <div className="mt-12 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Additional Security Resources</h2>
        <ul className="list-disc pl-6 space-y-2 text-blue-700">
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Frontend_Security_Cheat_Sheet.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">
              OWASP Frontend Security Cheat Sheet
            </a>
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">
              XSS Prevention Cheat Sheet
            </a>
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">
              CSRF Prevention Cheat Sheet
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SecurityCheck;
