import React, { useMemo } from 'react';
import {
  Box, Typography, Grid, Card, CardContent,
  Stack, CircularProgress, Chip,
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

// ── Stat card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  sub?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color, sub }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 1 }}>
            {label}
          </Typography>
          <Typography variant="h4" fontWeight={800} sx={{ color }}>
            {value}
          </Typography>
          {sub && (
            <Typography variant="caption" color="text.secondary">{sub}</Typography>
          )}
        </Box>
        <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: `${color}15` }}>
          <Box sx={{ color, display: 'flex' }}>{icon}</Box>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

// ── Analytics Page ────────────────────────────────────────────────────────────
const AnalyticsPage: React.FC = () => {
  const { applications, loading } = useApplications();
  const analytics = useMemo(() => computeAnalytics(applications), [applications]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={800}>Analytics</Typography>
        <Typography color="text.secondary">Your job search at a glance</Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <StatCard
            icon={<WorkRoundedIcon />}
            label="Total Applications"
            value={analytics.totalApplications}
            color="#2563EB"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            icon={<InsightsRoundedIcon />}
            label="Active"
            value={analytics.activeApplications}
            color="#D97706"
            sub="Applied + Interview"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            icon={<EmojiEventsRoundedIcon />}
            label="Offers"
            value={analytics.offersReceived}
            color="#059669"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            icon={<TrendingUpRoundedIcon />}
            label="Interview Rate"
            value={`${analytics.interviewRate}%`}
            color="#7C3AED"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Weekly bar chart */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography fontWeight={700} sx={{ mb: 3 }}>Applications per Week</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={analytics.weeklyApplications}
                  margin={{ top: 4, right: 16, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#94A3B8' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 13 }}
                    labelStyle={{ fontWeight: 700 }}
                  />
                  <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} name="Applications" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Status donut chart */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography fontWeight={700} sx={{ mb: 3 }}>Status Distribution</Typography>
              {analytics.totalApplications === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 280 }}>
                  <Typography color="text.disabled">No applications yet</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={analytics.statusDistribution.filter((d) => d.value > 0)}
                      cx="50%" cy="50%"
                      innerRadius={60} outerRadius={100}
                      paddingAngle={4} dataKey="value"
                    >
                      {analytics.statusDistribution.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 13 }}
                    />
                    <Legend
                      iconType="circle" iconSize={8}
                      formatter={(val) => (
                        <span style={{ fontSize: 13, color: '#64748B' }}>{val}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Status breakdown */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography fontWeight={700} sx={{ mb: 2.5 }}>Breakdown by Status</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                {analytics.statusDistribution.map((s) => (
                  <Box
                    key={s.name}
                    sx={{
                      flex: 1, p: 2, borderRadius: 2,
                      bgcolor: `${s.color}08`,
                      border: `1px solid ${s.color}22`,
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography fontWeight={600} fontSize="0.85rem" sx={{ color: s.color }}>
                        {s.name}
                      </Typography>
                      <Chip
                        label={s.value} size="small"
                        sx={{ fontWeight: 700, bgcolor: `${s.color}18`, color: s.color }}
                      />
                    </Stack>
                    <Typography variant="h5" fontWeight={800} sx={{ mt: 1, color: '#0F172A' }}>
                      {s.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {analytics.totalApplications > 0
                        ? Math.round((s.value / analytics.totalApplications) * 100)
                        : 0}% of total
                    </Typography>
                  </Box>
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