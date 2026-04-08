import { Save, Bell, Shield, Key } from 'lucide-react';
import { getSettings, updateSettings } from '@/app/actions/adminActions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SettingsPage({ searchParams }) {
  const params = await searchParams;
  const successMsg = params?.success || '';
  const settings = await getSettings();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <span className="font-medium">{successMsg}</span>
          </div>
          <Link href="/admin/settings" className="text-green-500 hover:text-green-700 transition-colors p-1 rounded-md hover:bg-green-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </Link>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Platform Settings</h2>
        <p className="text-gray-500 text-sm mt-1">Manage core platform configurations and preferences.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8">
        <form action={updateSettings} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">General Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Platform Name</label>
                <input 
                  type="text" 
                  name="platformName"
                  defaultValue={settings.platformName || "SmartPersona Resume Builder"} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" 
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Support Email</label>
                <input 
                  type="email" 
                  name="supportEmail"
                  defaultValue={settings.supportEmail || "support@smartpersona.com"} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" 
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Notifications</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="notifyNewUser"
                  defaultChecked={settings.notifyNewUser !== 'false'} 
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
                />
                <span className="text-sm text-gray-700">Email admin on new user registration</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="weeklyReport"
                  defaultChecked={settings.weeklyReport !== 'false'} 
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
                />
                <span className="text-sm text-gray-700">Weekly platform activity report</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm cursor-pointer">
              <Save size={16} />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
