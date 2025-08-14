import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto shadow-lg border-0">
        <CardContent className="p-12 text-center">
          {/* Loading Animation */}
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto mb-6">
              <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
              </div>
            </div>
            <div className="text-2xl font-semibold text-gray-700 mb-2">
              Loading...
            </div>
            <div className="text-gray-500">
              Please wait while we prepare your content
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="space-y-4">
            {/* Title Skeleton */}
            <Skeleton className="h-8 w-3/4 mx-auto" />
            
            {/* Content Skeletons */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6 mx-auto" />
              <Skeleton className="h-4 w-4/5 mx-auto" />
            </div>

            {/* Button Skeletons */}
            <div className="flex justify-center space-x-4 mt-8">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* Loading Messages */}
          <div className="mt-8 text-sm text-gray-400">
            <div className="animate-pulse">
              Fetching the latest opportunities...
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Alternative minimal loading component for faster pages
export function MinimalLoading() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
        <span className="text-gray-600">Loading...</span>
      </div>
    </div>
  );
}

// Loading component for specific sections
export function SectionLoading({ title = "Loading..." }: { title?: string }) {
  return (
    <div className="p-8 text-center">
      <div className="w-8 h-8 mx-auto mb-4 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  );
}
