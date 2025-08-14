import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search, ArrowLeft, MessageCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl border-0">
        <CardContent className="p-12 text-center">
          {/* 404 Animation */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text animate-pulse">
              404
            </div>
            <div className="text-2xl font-semibold text-gray-700 mt-4">
              Page Not Found
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h1 className="text-xl text-gray-600 mb-4">
              Oops! The page you're looking for doesn't exist.
            </h1>
            <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
              It might have been moved, deleted, or you entered the wrong URL. 
              Don't worry, let's get you back on track!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link href="/">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Button>
            </Link>
            
            <Link href="/jobs">
              <Button variant="outline" className="w-full py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                <Search className="w-5 h-5 mr-2" />
                Browse Jobs
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="border-t pt-8">
            <p className="text-sm text-gray-500 mb-4">Quick Links:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link 
                href="/companies" 
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Companies
              </Link>
              <Link 
                href="/training-institutes" 
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Training
              </Link>
              <Link 
                href="/trade-test-center" 
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Trade Tests
              </Link>
              <Link 
                href="/contact-us" 
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-3">
              <MessageCircle className="w-6 h-6 text-blue-600 mr-2" />
              <span className="text-lg font-semibold text-gray-700">Need Help?</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              If you believe this is an error, please contact our support team.
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

// Add metadata for SEO
export const metadata = {
  title: '404 - Page Not Found | Overseas.ai',
  description: 'The page you are looking for does not exist. Browse jobs, training, and overseas opportunities.',
  robots: 'noindex, nofollow',
};
