import React from 'react';
import { BarChart3 } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your Reddit marketing performance and conversions.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="text-center py-12">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Analytics coming soon
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Detailed analytics and performance metrics will be available here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;