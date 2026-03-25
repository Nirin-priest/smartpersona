"use client";
import { Save, Bell, Shield, Key } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Platform Settings</h2>
        <p className="text-gray-500 text-sm mt-1">Manage core platform configurations and preferences.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8">
        <div className="p-4 mb-6 bg-blue-50 text-blue-700 rounded-lg text-sm flex gap-3 items-center border border-blue-100">
          <Shield size={20} className="shrink-0" />
          <p><strong>Note:</strong> Settings are currently running in mock-mode for the presentation demo.</p>
        </div>

        <form className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">General Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Platform Name</label>
                <input type="text" defaultValue="SmartPersona Resume Builder" className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed text-sm" disabled />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Support Email</label>
                <input type="email" defaultValue="support@smartpersona.com" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Notifications</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                <span className="text-sm text-gray-700">Email admin on new user registration</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                <span className="text-sm text-gray-700">Weekly platform activity report</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button type="button" onClick={() => alert('Settings saved successfully! (Mock functionality)')} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm cursor-pointer">
              <Save size={16} />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
