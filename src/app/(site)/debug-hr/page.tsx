"use client";
import { useState, useEffect } from 'react';
import { useGlobalState } from '@/contexts/GlobalProvider';

export default function DebugHRPage() {
  const { globalState } = useGlobalState();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isHrUser, setIsHrUser] = useState(false);

  useEffect(() => {
    // Comprehensive HR detection
    const detectHRUser = () => {
      let detectedType = null;
      let hrDetected = false;
      const info: any = {};

      // Check localStorage
      try {
        const loggedUser = localStorage.getItem('loggedUser');
        const userData = localStorage.getItem('user');
        
        info.loggedUserRaw = loggedUser;
        info.userDataRaw = userData;

        if (loggedUser && loggedUser !== 'undefined') {
          const parsed = JSON.parse(loggedUser);
          info.loggedUserParsed = parsed;
          
          // Check all possible type locations
          const possibleTypes = [
            parsed?.type,
            parsed?.user?.type,
            parsed?.cmpData?.type,
            parsed?.userType,
            parsed?.role
          ];
          
          info.possibleTypes = possibleTypes;
          
          // Check for HR indicators
          const hrIndicators = {
            hasType: parsed?.type === 'company' || parsed?.user?.type === 'company',
            hasCmpData: !!parsed?.cmpData,
            hasHrId: !!parsed?.hrId,
            hasCompanyId: !!parsed?.companyId,
            hasUserCmpData: !!parsed?.user?.cmpData,
            hasUserHrId: !!parsed?.user?.hrId,
          };
          
          info.hrIndicators = hrIndicators;
          
          // Detect type
          detectedType = parsed?.type || 
                        parsed?.user?.type || 
                        parsed?.cmpData?.type ||
                        (parsed?.cmpData ? 'company' : null) ||
                        (parsed?.hrId ? 'company' : null);
        }
        
        if (userData && userData !== 'undefined') {
          const parsed = JSON.parse(userData);
          info.userParsed = parsed;
          
          if (!detectedType) {
            detectedType = parsed?.type || (parsed?.role === 'hr' ? 'company' : null);
          }
        }
      } catch (e) {
        info.error = e?.toString();
      }

      // Check global state
      info.globalState = {
        user: globalState?.user,
        userType: globalState?.user?.type,
        userUserType: globalState?.user?.user?.type,
      };

      // Final detection
      hrDetected = detectedType === 'company' || 
                   detectedType === 'hr' || 
                   detectedType === 'employer';
      
      info.detectedType = detectedType;
      info.isHR = hrDetected;
      
      setDebugInfo(info);
      setIsHrUser(hrDetected);
    };

    detectHRUser();
  }, [globalState]);

  const handleTestLogin = () => {
    // Simulate HR login
    const hrData = {
      type: 'company',
      user: {
        type: 'company',
        name: 'Test HR User',
        email: 'hr@test.com'
      },
      cmpData: {
        id: 1,
        cmpName: 'Test Company'
      },
      hrId: 'HR123',
      access_token: 'test_token'
    };
    
    localStorage.setItem('loggedUser', JSON.stringify(hrData));
    window.location.reload();
  };

  const handleClearData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">HR User Detection Debug Page</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Detection Result</h2>
        <div className={`p-4 rounded-lg ${isHrUser ? 'bg-green-100' : 'bg-red-100'}`}>
          <p className="text-lg font-semibold">
            Is HR User: <span className={isHrUser ? 'text-green-600' : 'text-red-600'}>{isHrUser ? 'YES' : 'NO'}</span>
          </p>
          <p className="mt-2">Detected Type: <strong>{debugInfo.detectedType || 'None'}</strong></p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">localStorage Data</h2>
        
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">loggedUser (Raw):</h3>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
            {debugInfo.loggedUserRaw || 'Not found'}
          </pre>
        </div>
        
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">loggedUser (Parsed):</h3>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(debugInfo.loggedUserParsed, null, 2) || 'Not found'}
          </pre>
        </div>
        
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">user (Parsed):</h3>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(debugInfo.userParsed, null, 2) || 'Not found'}
          </pre>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">HR Indicators</h2>
        <div className="grid grid-cols-2 gap-4">
          {debugInfo.hrIndicators && Object.entries(debugInfo.hrIndicators).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm font-medium">{key}:</span>
              <span className={`text-sm font-semibold ${value ? 'text-green-600' : 'text-gray-400'}`}>
                {value ? '✓' : '✗'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Possible Type Locations</h2>
        <ul className="space-y-2">
          {debugInfo.possibleTypes?.map((type: any, index: number) => (
            <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">Location {index + 1}:</span>
              <span className="text-sm font-semibold">{type || 'undefined'}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Global State</h2>
        <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
          {JSON.stringify(debugInfo.globalState, null, 2)}
        </pre>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        <div className="flex gap-4">
          <button
            onClick={handleTestLogin}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Simulate HR Login
          </button>
          <button
            onClick={handleClearData}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear All Data
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Refresh Page
          </button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm text-yellow-800">
          <strong>Instructions:</strong> Visit this page while logged in as an HR user to see what data is stored and why detection might be failing.
        </p>
      </div>
    </div>
  );
}
