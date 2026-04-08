"use client";

import React, { useState, useEffect } from 'react';
import { Users, FileText, Activity, TrendingUp } from 'lucide-react';

export default function LiveStats({ initialStats }) {
  const [stats, setStats] = useState(initialStats);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const POLL_INTERVAL = 30000; // 30 วินาที

    const fetchStats = async () => {
      // หยุด polling เมื่อ tab ถูกซ่อน ประหยัด server load
      if (document.hidden) return;
      try {
        setIsUpdating(true);
        const res = await fetch('/api/admin/stats', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setStats(prev => ({
            ...prev,
            totalUsers: data.totalUsers,
            totalResumes: data.totalResumes,
            conversionRate: data.totalUsers > 0
              ? ((data.totalUsersWithResumes || 0) / data.totalUsers * 100).toFixed(1) + '%'
              : prev.conversionRate
          }));
        }
      } catch (error) {
        console.error('Polling error:', error);
      } finally {
        setTimeout(() => setIsUpdating(false), 800);
      }
    };

    const interval = setInterval(fetchStats, POLL_INTERVAL);

    // หยุดเมื่อกลับมาที่ tab ให้ fetch ทันที แทนที่จะรอ interval
    const handleVisibilityChange = () => {
      if (!document.hidden) fetchStats();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const statsConfig = [
    { name: 'Total Users', value: stats.totalUsers?.toLocaleString(), icon: Users },
    { name: 'Total Resumes', value: stats.totalResumes?.toLocaleString(), icon: FileText },
    { name: 'Active Users (24h)', value: stats.activeUsers24h?.toLocaleString(), icon: Activity },
    { name: 'Conversion Rate', value: stats.conversionRate, icon: TrendingUp },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden"
          >
            {/* Live Indicator Pulse */}
            {isUpdating && (
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-[pulse_1s_infinite]"></div>
            )}
            
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-50 p-3 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Icon size={24} />
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-100 text-green-700">
                <span className={`w-1.5 h-1.5 rounded-full bg-green-500 ${isUpdating ? 'animate-ping' : ''}`}></span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Live</span>
              </div>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.name}</h3>
              <p className="text-3xl font-bold text-gray-800 transition-all">
                {stat.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
