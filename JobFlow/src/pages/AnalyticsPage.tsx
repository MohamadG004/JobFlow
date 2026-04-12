import React, { useMemo } from 'react';
import {
  Box, Typography, Grid, Card, CardContent,
  Stack, CircularProgress,
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useApplications } from '@/hooks/useApplications';
import { computeAnalytics } from '@/utils/analytics';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';

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
  <Card sx={{ height: '100%', transition: 'box-shadow 0.2s ease, transform 0.2s ease', '&:hover': { boxShadow: '0 8px 24px rgba(13,15,23,0.09)', transform: 'translateY(-2px)' } }}>
    <CardContent sx={{ p: 2.5 }}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#6B7180', mb: 1, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            {label}
          </Typography>
          <Typography sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, fontSize: '2rem', color, lineHeight: 1, letterSpacing: '-0.03em' }}>
            {value}
          </Typography>
          {sub && (
            <Typography sx={{ fontSize: '0.75rem', color: '#9CA3AF', mt: 0.75 }}>
              {sub}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            width: 42, height: 42, borderRadius: '11px', flexShrink: 0,
            bgcolor: bgColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Box sx={{ color, display: 'flex', fontSize: '1.2rem' }}>{icon}</Box>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomBarTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: '#0D0F17', color: '#fff', borderRadius: '10px',
          px: 2, py: 1.5, boxShadow: '0 8px 24px rgba(13,15,23,0.20)',
        }}
      >
        <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', mb: 0.25 }}>{label}</Typography>
        <Typography sx={{ fontFamily: '"Sora",sans-serif', fontWeight: 800, fontSize: '1.1rem' }}>
          {payload[0].value} <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 400, opacity: 0.6 }}>apps</Box>
        </Typography>
      </Box>
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
    <Box
      sx={{
        flex: 1,
        p: 2.5, borderRadius: '12px',
        bgcolor: `${color}07`,
        border: `1px solid ${color}20`,
        transition: 'all 0.18s ease',
        '&:hover': { bgcolor: `${color}11`, borderColor: `${color}35` },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: color }} />
          <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color }}>
            {name}
          </Typography>
        </Stack>
        <Box
          sx={{
            px: 1, py: 0.25,
            bgcolor: `${color}18`, borderRadius: '6px',
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: '0.72rem', color }}>
            {pct}%
          </Typography>
        </Box>
      </Stack>
      <Typography sx={{ fontFamily: '"Sora",sans-serif', fontWeight: 800, fontSize: '1.75rem', color: '#0D0F17', lineHeight: 1, letterSpacing: '-0.03em' }}>
        {value}
      </Typography>
      {/* Progress bar */}
      <Box sx={{ mt: 1.5, height: 3, borderRadius: '2px', bgcolor: `${color}18`, overflow: 'hidden' }}>
        <Box sx={{ width: `${pct}%`, height: '100%', bgcolor: color, borderRadius: '2px', transition: 'width 0.8s ease' }} />
      </Box>
    </Box>
  );
};

// ── Analytics Page ────────────────────────────────────────────────────────────
const AnalyticsPage: React.FC = () => {
  const { applications, loading } = useApplications();
  const analytics = useMemo(() => computeAnalytics(applications), [applications]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={28} thickness={3} sx={{ color: '#2D52E0' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, maxWidth: 1200 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, letterSpacing: '-0.02em', mb: 0.5 }}>
          Analytics
        </Typography>
        <Typography sx={{ color: '#6B7180', fontSize: '0.9rem' }}>
          Your job search at a glance
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid item xs={6} lg={3}>
          <StatCard
            icon={<WorkRoundedIcon sx={{ fontSize: 20 }} />}
            label="Total"
            value={analytics.totalApplications}
            color="#2D52E0"
            bgColor="#EEF2FF"
          />
        </Grid>
        <Grid item xs={6} lg={3}>
          <StatCard
            icon={<InsightsRoundedIcon sx={{ fontSize: 20 }} />}
            label="Active"
            value={analytics.activeApplications}
            color="#C27803"
            bgColor="#FFFBEB"
            sub="Applied + Interview"
          />
        </Grid>
        <Grid item xs={6} lg={3}>
          <StatCard
            icon={<EmojiEventsRoundedIcon sx={{ fontSize: 20 }} />}
            label="Offers"
            value={analytics.offersReceived}
            color="#047857"
            bgColor="#ECFDF5"
          />
        </Grid>
        <Grid item xs={6} lg={3}>
          <StatCard
            icon={<TrendingUpRoundedIcon sx={{ fontSize: 20 }} />}
            label="Interview Rate"
            value={`${analytics.interviewRate}%`}
            color="#7C3AED"
            bgColor="#F5F3FF"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        {/* Bar chart */}
        <Grid item xs={12} lg={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontFamily: '"Sora",sans-serif', fontWeight: 700, fontSize: '0.9375rem', mb: 0.25 }}>
                  Applications per Week
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Last 8 weeks</Typography>
              </Box>
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
            </CardContent>
          </Card>
        </Grid>

        {/* Donut chart */}
        <Grid item xs={12} lg={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontFamily: '"Sora",sans-serif', fontWeight: 700, fontSize: '0.9375rem', mb: 0.25 }}>
                  Status Distribution
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#9CA3AF' }}>All time</Typography>
              </Box>
              {analytics.totalApplications === 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 260, gap: 1.5 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: '#F0EDE8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    📊
                  </Box>
                  <Typography sx={{ color: '#C4C0BC', fontSize: '0.875rem' }}>No applications yet</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={analytics.statusDistribution.filter((d) => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {analytics.statusDistribution.map((entry) => (
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
            </CardContent>
          </Card>
        </Grid>

        {/* Status breakdown row */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Typography sx={{ fontFamily: '"Sora",sans-serif', fontWeight: 700, fontSize: '0.9375rem', mb: 2.5 }}>
                Breakdown by Status
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                {analytics.statusDistribution.map((s) => (
                  <StatusRowCard
                    key={s.name}
                    name={s.name}
                    value={s.value}
                    color={s.color}
                    total={analytics.totalApplications}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsPage;