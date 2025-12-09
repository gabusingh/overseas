'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log catastrophic error
    
    // Send to error tracking service
    // Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-2xl mx-auto text-center bg-white rounded-lg shadow-2xl p-12">
            {/* Critical Error Icon */}
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
            
            {/* Error Message */}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Critical Error
            </h1>
            
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              A critical error has occurred in the application. We apologize for the inconvenience.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-8 p-6 bg-red-50 rounded-lg border border-red-100 text-left max-w-lg mx-auto">
                <details>
                  <summary className="cursor-pointer text-red-600 font-medium mb-2">
                    Technical Details (Development)
                  </summary>
                  <pre className="text-xs bg-red-100 p-3 rounded border overflow-auto max-h-40">
                    <code>{error.message}</code>
                    {error.stack && (
                      <>
                        <br />
                        <br />
                        <code>{error.stack}</code>
                      </>
                    )}
                  </pre>
                </details>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <button
                onClick={reset}
                className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
              </button>
              
              <a
                href="/"
                className="inline-flex items-center px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-medium transition-colors duration-200"
              >
                Go to Home
              </a>
            </div>

            {/* Support Information */}
            <div className="border-t pt-8">
              <p className="text-sm text-gray-500 mb-4">
                If this error persists, please contact support:
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm">
                <a 
                  href="mailto:support@overseas.ai" 
                  className="text-blue-600 hover:text-blue-800"
                >
                  support@overseas.ai
                </a>
                <a 
                  href="/contact-us" 
                  className="text-blue-600 hover:text-blue-800"
                >
                  Contact Form
                </a>
              </div>
              
              {error.digest && (
                <p className="text-xs text-gray-400 mt-4">
                  Error Reference: {error.digest}
                </p>
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
