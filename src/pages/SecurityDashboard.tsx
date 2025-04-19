
import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from '@/components/ui/tabs';
import { SecurityCheckList } from '@/components/security/SecurityCheckList';
import { SecuritySecretRotation } from '@/components/security/SecuritySecretRotation';
import { hasCriticalVulnerabilities } from '@/utils/security/dependencyManager';
import { toast } from 'sonner';

export default function SecurityDashboard() {
  const [securityScore, setSecurityScore] = useState<number | null>(null);
  
  const handleCheckComplete = (passed: number, total: number) => {
    const score = Math.round((passed / total) * 100);
    setSecurityScore(score);
    
    if (score < 70) {
      toast.error('Your security score needs improvement!');
    } else if (score < 90) {
      toast.warning('Your security score is good, but could be better.');
    } else {
      toast.success('Excellent security score!');
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Security Dashboard</h1>
        <p className="text-gray-600">
          Monitor and manage the security of your application.
        </p>
        
        {securityScore !== null && (
          <div className="mt-4 p-4 border rounded-lg bg-white shadow-sm">
            <div className="flex items-center">
              <div 
                className={`text-2xl font-bold mr-3 ${
                  securityScore >= 90 ? 'text-green-600' :
                  securityScore >= 70 ? 'text-yellow-600' :
                  'text-red-600'
                }`}
              >
                {securityScore}%
              </div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      securityScore >= 90 ? 'bg-green-500' :
                      securityScore >= 70 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${securityScore}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Security Health Score
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="checks">
        <TabList className="mb-4 border-b">
          <Tab value="checks" className="px-4 py-2 font-medium">Security Checks</Tab>
          <Tab value="secrets" className="px-4 py-2 font-medium">Secret Management</Tab>
          <Tab value="reports" className="px-4 py-2 font-medium">Reports</Tab>
        </TabList>
        
        <TabPanel value="checks" className="p-4 bg-white rounded-lg shadow-sm">
          <SecurityCheckList onCheckComplete={handleCheckComplete} />
        </TabPanel>
        
        <TabPanel value="secrets" className="p-4 bg-white rounded-lg shadow-sm">
          <SecuritySecretRotation />
        </TabPanel>
        
        <TabPanel value="reports" className="p-4 bg-white rounded-lg shadow-sm">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Security Reports</h3>
              <p className="text-gray-600">
                Download and view security reports for your application.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Dependency Vulnerability Report</h4>
                    <p className="text-sm text-gray-500">Last updated: Today</p>
                  </div>
                  <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    Download
                  </button>
                </div>
              </div>
              
              <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">CSRF Protection Audit</h4>
                    <p className="text-sm text-gray-500">Last updated: Yesterday</p>
                  </div>
                  <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    Download
                  </button>
                </div>
              </div>
              
              <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Rate Limiting Effectiveness</h4>
                    <p className="text-sm text-gray-500">Last updated: 3 days ago</p>
                  </div>
                  <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      </Tabs>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Security Recommendations</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Consider commissioning an external penetration test for thorough security assessment</li>
          <li>Implement IndexedDB encryption for all offline data storage</li>
          <li>Add rate-limiting middleware to prevent API abuse</li>
          <li>Ensure all authentication endpoints use HttpOnly and SameSite=Strict cookies</li>
          <li>Store all API keys and credentials in a secure vault and rotate them regularly</li>
        </ul>
      </div>
    </div>
  );
}
