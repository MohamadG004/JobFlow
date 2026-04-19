import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useApplications } from '@/hooks/useApplications';
import { computeAnalytics } from '@/utils/analytics';
import { TrendingUp, Briefcase, Trophy, BarChart3, Loader2 } from 'lucide-react';

// ── Stat Card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
  sub?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color, bgColor, sub }) => (
  <div className="h-full rounded-xl border border-[#EEECE8] bg-white p-5 transition-all hover:shadow-lg hover:-translate-y-0.5">
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[#6B7180] mb-1 uppercase tracking-wide">{label}</p>
        <p className="text-3xl font-extrabold" style={{ color, fontFamily: 'Sora, sans-serif', letterSpacing: '-0.03em', lineHeight: 1 }}>
          {value}
        </p>
        {sub && <p className="text-xs text-[#9CA3AF] mt-2">{sub}</p>}
      </div>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: bgColor }}>
        <span style={{ color }}>{icon}</span>
      </div>
    </div>
  </div>
);

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomBarTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0D0F17] text-white rounded-lg px-3 py-2 shadow-xl" style={{ boxShadow: '0 8px 24px rgba(13,15,23,0.20)' }}>
        <p className="text-xs text-white/50 mb-0.5">{label}</p>
        <p className="text-lg font-extrabold">
          {payload[0].value} <span className="text-xs font-normal opacity-60">apps</span>
        </p>
      </div>
    );
  }
  return null;
};

// ── Status Row Card ───────────────────────────────────────────────────────────
const StatusRowCard: React.FC<{
  name: string;
  value: number;
  color: string;
  total: number;
}> = ({ name, value, color, total }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div
      className="flex-1 p-5 rounded-xl border transition-all hover:border-opacity-60"
      style={{ backgroundColor: `${color}07`, borderColor: `${color}20` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-xs font-bold" style={{ color }}>{name}</span>
        </div>
        <span className="px-2 py-0.5 rounded-md text-xs font-bold" style={{ backgroundColor: `${color}18`, color }}>
          {pct}%
        </span>
      </div>
      <p className="text-2xl font-extrabold text-[#0D0F17]" style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.03em', lineHeight: 1 }}>
        {value}
      </p>
      <div className="mt-3 h-0.75 rounded-sm" style={{ backgroundColor: `${color}18`, overflow: 'hidden' }}>
        <div className="h-full rounded-sm transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
};

// ── Analytics Page ────────────────────────────────────────────────────────────
const AnalyticsPage: React.FC = () => {
  const { applications, loading } = useApplications();
  const analytics = useMemo(() => computeAnalytics(applications), [applications]);
  const filteredStatus = analytics.statusDistribution.filter((d) => d.value > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="w-7 h-7 text-[var(--color-primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1200px]">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-[#0D0F17] mb-1" style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}>
          Analytics
        </h2>
        <p className="text-sm text-[#6B7180]">Your job search at a glance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<Briefcase size={20} />}
          label="Total"
          value={analytics.totalApplications}
          color="#2D52E0"
          bgColor="#EEF2FF"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Active"
          value={analytics.activeApplications}
          color="#C27803"
          bgColor="#FFFBEB"
          sub="Applied + Interview"
        />
        <StatCard
          icon={<Trophy size={20} />}
          label="Offers"
          value={analytics.offersReceived}
          color="#047857"
          bgColor="#ECFDF5"
          sub={analytics.offersReceived > 0 ? "Congratulations!" : "You got this!"}
        />
        <StatCard
          icon={<BarChart3 size={20} />}
          label="Interview Rate"
          value={`${analytics.interviewRate}%`}
          color="#7C3AED"
          bgColor="#F5F3FF"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Bar chart */}
        <div className="lg:col-span-7">
          <div className="h-full rounded-xl border border-[#EEECE8] bg-white p-5 md:p-6">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-[#0D0F17] mb-0.5" style={{ fontFamily: 'Sora, sans-serif' }}>Applications per Week</h3>
              <p className="text-xs text-[#9CA3AF]">Last 8 weeks</p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={analytics.weeklyApplications}
                margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" vertical={false} />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: '#C4C0BC', fontFamily: '"DM Sans",sans-serif' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#C4C0BC', fontFamily: '"DM Sans",sans-serif' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(45,82,224,0.04)' }} />
                <Bar
                  dataKey="count"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                  name="Applications"
                  maxBarSize={40}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2D52E0" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#4A3FDB" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut chart */}
        <div className="lg:col-span-5">
          <div className="h-full rounded-xl border border-[#EEECE8] bg-white p-5 md:p-6">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-[#0D0F17] mb-0.5" style={{ fontFamily: 'Sora, sans-serif' }}>Status Distribution</h3>
              <p className="text-xs text-[#9CA3AF]">All time</p>
            </div>
            {analytics.totalApplications === 0 ? (
              <div className="flex flex-col items-center justify-center h-[260px] gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#F0EDE8] flex items-center justify-center">
                  <BarChart3 className="w-7 h-7 text-[#5c5c5c]" />
                </div>
                <p className="text-base text-[#5c5c5c]">No applications yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={filteredStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {filteredStatus.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D0F17',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '0.8125rem',
                      fontFamily: '"DM Sans",sans-serif',
                    }}
                    itemStyle={{ color: 'rgba(255,255,255,0.8)' }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={7}
                    formatter={(val) => (
                      <span style={{ fontSize: 12, color: '#6B7180', fontFamily: '"DM Sans",sans-serif' }}>{val}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Status breakdown row */}
        <div className="lg:col-span-12">
          <div className="rounded-xl border border-[#EEECE8] bg-white p-5 md:p-6">
            <h3 className="text-sm font-bold text-[#0D0F17] mb-5" style={{ fontFamily: 'Sora, sans-serif' }}>Breakdown by Status</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              {analytics.statusDistribution.map((s) => (
                <StatusRowCard
                  key={s.name}
                  name={s.name}
                  value={s.value}
                  color={s.color}
                  total={analytics.totalApplications}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;