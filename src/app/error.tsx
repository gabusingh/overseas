'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    // Optional: Send to error tracking service
    // logErrorToService(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl border-0">
        <CardContent className="p-12 text-center">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              Something went wrong!
            </div>
            <div className="text-lg text-gray-600">
              We apologize for the inconvenience
            </div>
          </div>

          {/* Error Details */}
          <div className="mb-8 p-6 bg-red-50 rounded-lg border border-red-100">
            <p className="text-red-800 text-sm mb-4">
              An unexpected error occurred while processing your request.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left">
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
            )}
            {error.digest && (
              <p className="text-xs text-red-600 mt-4">
                Error ID: {error.digest}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Button
              onClick={reset}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
            
            <Link href="/">
              <Button 
                variant="outline" 
                className="w-full py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>

          {/* What You Can Do */}
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              What you can do:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="text-left">
                <ul className="space-y-2">
                  <li>• Refresh the page</li>
                  <li>• Check your internet connection</li>
                  <li>• Clear your browser cache</li>
                </ul>
              </div>
              <div className="text-left">
                <ul className="space-y-2">
                  <li>• Try again in a few minutes</li>
                  <li>• Go back to the home page</li>
                  <li>• Contact support if issue persists</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-3">
              <MessageCircle className="w-6 h-6 text-blue-600 mr-2" />
              <span className="text-lg font-semibold text-gray-700">Still Having Issues?</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Our support team is here to help you resolve this issue.
            </p>
            <Link href="/contact-us">
              <Button variant="outline" size="sm" className="transition-all duration-300 hover:bg-blue-50">
                Contact Support
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Custom error logging function (implement based on your error tracking service)
function logErrorToService(error: Error) {
  // Example: Send to Sentry, LogRocket, or similar service
  // Sentry.captureException(error);
}
