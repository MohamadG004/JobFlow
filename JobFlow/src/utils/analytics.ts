// src/utils/analytics.ts
import { format, startOfWeek, eachWeekOfInterval, subWeeks } from 'date-fns';
import type { Application, AnalyticsData } from '@/types';

export const STATUS_COLORS: Record<string, string> = {
  Applied: '#3B82F6',
  Interview: '#F59E0B',
  Offer: '#10B981',
  Rejected: '#EF4444',
};

export function computeAnalytics(applications: Application[]): AnalyticsData {
  const total = applications.length;

  const statusCounts = applications.reduce<Record<string, number>>((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const statusDistribution = (['Applied', 'Interview', 'Offer', 'Rejected'] as const).map((s) => ({
    name: s,
    value: statusCounts[s] || 0,
    color: STATUS_COLORS[s],
  }));

  // Weekly applications (last 8 weeks)
  const now = new Date();
  const eightWeeksAgo = subWeeks(now, 7);
  const weeks = eachWeekOfInterval({ start: eightWeeksAgo, end: now });

  const weeklyApplications = weeks.map((weekStart) => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const count = applications.filter((app) => {
      const appliedDate = new Date(app.applied_date);
      return appliedDate >= weekStart && appliedDate <= weekEnd;
    }).length;

    return {
      week: format(weekStart, 'MMM d'),
      count,
    };
  });

  const activeApplications = (statusCounts['Applied'] || 0) + (statusCounts['Interview'] || 0);
  const offersReceived = statusCounts['Offer'] || 0;
  const interviewRate = total > 0
    ? Math.round(((statusCounts['Interview'] || 0) + offersReceived) / total * 100)
    : 0;

  return {
    statusDistribution,
    weeklyApplications,
    totalApplications: total,
    activeApplications,
    offersReceived,
    interviewRate,
  };
}
