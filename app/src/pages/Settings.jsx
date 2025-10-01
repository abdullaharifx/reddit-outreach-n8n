import React from 'react';
import { Settings as SettingsIcon, Cog } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your Reddit API settings and automation preferences.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="text-center py-12">
            <Cog className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Settings coming soon
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Configuration options will be available here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;