// src/utils/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563EB',
      light: '#3B82F6',
      dark: '#1D4ED8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7C3AED',
      light: '#8B5CF6',
      dark: '#6D28D9',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B',
      light: '#FCD34D',
      dark: '#D97706',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
    },
    divider: '#E2E8F0',
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(15,23,42,0.05)',
    '0px 1px 4px rgba(15,23,42,0.08)',
    '0px 2px 8px rgba(15,23,42,0.08)',
    '0px 4px 16px rgba(15,23,42,0.08)',
    '0px 8px 24px rgba(15,23,42,0.08)',
    '0px 12px 32px rgba(15,23,42,0.10)',
    '0px 16px 40px rgba(15,23,42,0.10)',
    '0px 20px 48px rgba(15,23,42,0.12)',
    '0px 24px 56px rgba(15,23,42,0.12)',
    '0px 28px 64px rgba(15,23,42,0.14)',
    '0px 32px 72px rgba(15,23,42,0.14)',
    '0px 36px 80px rgba(15,23,42,0.16)',
    '0px 40px 88px rgba(15,23,42,0.16)',
    '0px 44px 96px rgba(15,23,42,0.18)',
    '0px 48px 104px rgba(15,23,42,0.18)',
    '0px 52px 112px rgba(15,23,42,0.20)',
    '0px 56px 120px rgba(15,23,42,0.20)',
    '0px 60px 128px rgba(15,23,42,0.22)',
    '0px 64px 136px rgba(15,23,42,0.22)',
    '0px 68px 144px rgba(15,23,42,0.24)',
    '0px 72px 152px rgba(15,23,42,0.24)',
    '0px 76px 160px rgba(15,23,42,0.26)',
    '0px 80px 168px rgba(15,23,42,0.26)',
    '0px 84px 176px rgba(15,23,42,0.28)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 20px',
          fontSize: '0.9rem',
        },
        contained: {
          boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(37,99,235,0.35)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 8px rgba(15,23,42,0.06)',
          border: '1px solid #F1F5F9',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #F1F5F9',
          boxShadow: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 0 #F1F5F9',
        },
      },
    },
  },
});
