"use client";

import React, { useState } from 'react';
import { getAppliedJobs } from '../services/job.service';
import { useGlobalState } from '../contexts/GlobalProvider';

export default function AppliedJobsDebug() {
  const { globalState } = useGlobalState();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setDebugInfo(null);

    const info: any = {
      globalState: globalState,
      user: globalState?.user,
      token: globalState?.user?.access_token,
      localStorage: {
        access_token: typeof window !== 'undefined' ? localStorage.getItem('access_token') : 'N/A',
        loggedUser: typeof window !== 'undefined' ? localStorage.getItem('loggedUser') : 'N/A',
        user: typeof window !== 'undefined' ? localStorage.getItem('user') : 'N/A'
      }
    };

    try {
      const token = globalState?.user?.access_token || '';
      if (token) {
        console.log('Testing API with token:', token.substring(0, 20) + '...');
        const response = await getAppliedJobs(token);
        info.apiResponse = response;
        info.apiData = response?.data;
        info.apiJobs = response?.data?.jobs;
        info.success = true;
      } else {
        info.error = 'No token available';
      }
    } catch (error: any) {
      info.error = error.message;
      info.errorDetails = {
        status: error.response?.status,
        data: error.response?.data
      };
    }

    setDebugInfo(info);
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 my-4">
      <h3 className="text-lg font-bold mb-4">Applied Jobs API Debug</h3>
      
      <button 
        onClick={testAPI}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test API'}
      </button>

      {debugInfo && (
        <div className="mt-4 p-4 bg-white rounded border">
          <h4 className="font-semibold mb-2">Debug Information:</h4>
          <pre className="text-xs overflow-auto max-h-96 bg-gray-100 p-2 rounded">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
