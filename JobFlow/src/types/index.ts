// src/types/index.ts

export type ApplicationStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export interface Application {
  id: string;
  user_id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  notes: string;
  applied_date: string;
  created_at: string;
}

export interface ApplicationInsert {
  company: string;
  role: string;
  status: ApplicationStatus;
  notes?: string;
  applied_date: string;
}

export interface ApplicationUpdate extends Partial<ApplicationInsert> {
  id: string;
}

export interface User {
  id: string;
  email: string;
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface KanbanColumn {
  id: ApplicationStatus;
  title: string;
  color: string;
  bgColor: string;
  applications: Application[];
}

export interface AnalyticsData {
  statusDistribution: { name: ApplicationStatus; value: number; color: string }[];
  weeklyApplications: { week: string; count: number }[];
  totalApplications: number;
  activeApplications: number;
  offersReceived: number;
  interviewRate: number;
}

export type SnackbarSeverity = 'success' | 'error' | 'info' | 'warning';

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
}
