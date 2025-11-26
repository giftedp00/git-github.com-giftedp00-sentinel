import React, { useMemo } from 'react';
import { Alert } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, Mail, Activity, Hash } from 'lucide-react';

interface DashboardStatsProps {
  alerts: Alert[];
  emailCount: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ alerts, emailCount }) => {
  const platformData = useMemo(() => {
    const counts: Record<string, number> = {};
    alerts.forEach(a => {
      counts[a.platform] = (counts[a.platform] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key],
    }));
  }, [alerts]);

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Stat Cards */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center space-x-4">
        <div className="p-3 bg-red-500/10 rounded-lg text-red-500">
          <AlertTriangle size={24} />
        </div>
        <div>
          <p className="text-slate-400 text-sm font-medium">Total Alerts</p>
          <h3 className="text-2xl font-bold text-white">{alerts.length}</h3>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center space-x-4">
        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
          <Mail size={24} />
        </div>
        <div>
          <p className="text-slate-400 text-sm font-medium">Emails Sent</p>
          <h3 className="text-2xl font-bold text-white">{emailCount}</h3>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center space-x-4">
        <div className="p-3 bg-green-500/10 rounded-lg text-green-500">
          <Activity size={24} />
        </div>
        <div>
          <p className="text-slate-400 text-sm font-medium">Active Monitors</p>
          <h3 className="text-2xl font-bold text-white">2</h3>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center space-x-4">
        <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
          <Hash size={24} />
        </div>
        <div>
          <p className="text-slate-400 text-sm font-medium">Last Detection</p>
          <h3 className="text-lg font-bold text-white">
            {alerts.length > 0 ? new Date(alerts[0].timestamp).toLocaleTimeString() : 'N/A'}
          </h3>
        </div>
      </div>

      {/* Chart */}
      <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-slate-900 border border-slate-800 p-6 rounded-xl mt-4 h-80">
        <h4 className="text-lg font-semibold text-white mb-4">Alerts by Platform</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={platformData}>
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {platformData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardStats;